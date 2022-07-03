fetch('data.json').then(function (response) {
  return response.json();
}).then(function (obj) {
  createAllComments(obj);
}).catch (function (error) {
  console.error('Something went wrong retrieving the JSON file.');
  console.error(error);
})

function createAllComments(jsonObject) {
  let comments = jsonObject;
  let commentContainer = document.getElementById('comment-list');
  if (Array.isArray(jsonObject.comments)) {
    comments = jsonObject.comments;
  } else {
    replyCont = document.createElement('div');
    replyCont.classList.add('reply_container');
    replyCont.id = "reply_cont" + jsonObject[0].replyingTo;
    commentContainer.appendChild(replyCont);
    
    commentContainer = document.getElementById("reply_cont" + jsonObject[0].replyingTo);
  }
  comments.forEach(function(jsonComment) {
    if (!Array.isArray(jsonObject.comments)) {
      vertLine = document.createElement('div');
      vertLine.classList.add('reply_vertical_line');
      commentContainer.appendChild(vertLine);
    }
    let comment = createComment(jsonComment);
    commentContainer.appendChild(comment);
    if (Array.isArray(jsonComment.replies) && jsonComment.replies.length != 0) {
      createAllComments(jsonComment.replies);
    }
  });
}

function createComment(jsonComment) {
  const comment = document.createElement('li');
  if (jsonComment.replyingTo !== undefined) {
    comment.classList.add('comment--reply')
  }
  comment.classList.add('comment');
  comment.classList.add('bg-white');
  comment.id = jsonComment.id;

  comment.appendChild(createCommentVoter(jsonComment));
  comment.appendChild(createCommentAvatar(jsonComment));
  comment.appendChild(createCommentText(jsonComment));
  comment.appendChild(createCommentReply(jsonComment));

  return comment;
}

function createCommentVoter(jsonObject) {
  const commentVoter = document.createElement('div');
  commentVoter.classList.add('comment_voter');

  const upvoteBtn = document.createElement('button');
  upvoteBtn.classList.add('comment_voter--icon');
  upvoteBtn.classList.add('vote--up');

  const downVoteBtn = document.createElement('button');
  downVoteBtn.classList.add('comment_voter--icon');
  downVoteBtn.classList.add('vote--down')

  const counter = jsonObject.score;
  const voteCount = document.createElement('p');
  voteCount.classList.add('comment_voter--count');
  voteCount.textContent = counter;

  commentVoter.appendChild(upvoteBtn);
  commentVoter.appendChild(voteCount);
  commentVoter.appendChild(downVoteBtn);

  return commentVoter;
}

function createCommentAvatar(jsonObject) {
  console.log(jsonObject);
  const commentAvatar = document.createElement('div');
  commentAvatar.classList.add('comment_avatar');

  const avatar_img = document.createElement('img');
  avatar_img.classList.add('comment_avatar--img');
  const img = jsonObject.user.image.webp;
  avatar_img.src = img;

  const avatar_userName = document.createElement('h2');
  avatar_userName.textContent = jsonObject.user.username;

  const creationTime = document.createElement('p');
  creationTime.textContent = jsonObject.createdAt;

  commentAvatar.appendChild(avatar_img);
  commentAvatar.appendChild(avatar_userName);
  commentAvatar.appendChild(creationTime);

  return commentAvatar;
}

function createCommentText(jsonObject) {
  const textDiv = document.createElement('div');
  textDiv.classList.add('comment_text');

  const commentText = document.createElement('p');
  commentText.textContent = jsonObject.content;

  textDiv.appendChild(commentText);

  return textDiv;
}

function createCommentReply(jsonObject) {
  const replyBtn = document.createElement('button');
  replyBtn.classList.add('comment_reply');

  const replyIcon = document.createElement('img');
  replyIcon.src = 'images/icon-reply.svg';

  const replyText = document.createElement('p');
  replyText.textContent = 'Reply';

  replyBtn.appendChild(replyIcon);
  replyBtn.appendChild(replyText);

  return replyBtn;
}