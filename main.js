fetch('data.json').then(function (response) {
  return response.json();
}).then(function (obj) {
  createAllComments(obj);
}).catch (function (error) {
  console.error('Something went wrong retrieving the JSON file.');
  console.error(error);
})

class Comment {
  constructor(id, content, createdAt, score, user, replies = [], replyingTo = null) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.score = score;
    this.user = user;
    this.replies = replies;
    this.replyingTo = replyingTo;
  }

  getId() { return this.id; }
  getContent() { return this.content; }
  getCreatedAt() { return this.createdAt; }
  getScore() { return this.score; }
  getUser() { return this.user; }
  getReplies() { return this.replies; }
  getReplyingTo() {return this.replyingTo; }
}

function createAllComments(jsonObject, currUser = null) {
  if (currUser == null) {
    currUser = jsonObject.currentUser.username;
  }
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
    console.log(jsonComment.user.username);
    console.log(currUser);
    console.log(jsonComment.user.username == currUser);
    if (jsonComment.user.username == currUser) {
      comment.removeChild(comment.querySelector('.comment_reply'));
      btnDiv = document.createElement('div');
      btnDiv.classList.add('btn-container');
      btnDiv.appendChild(createCommentDel());
      btnDiv.appendChild(createCommentEdit());
      comment.appendChild(btnDiv);
      currentUserTag = document.createElement('p');
      currentUserTag.classList.add('current-user_tag');
      currentUserTag.textContent = 'you';
      comment.querySelector('.comment_avatar h2').after(currentUserTag);
    }
    commentContainer.appendChild(comment);
    if (Array.isArray(jsonComment.replies) && jsonComment.replies.length != 0) {
      createAllComments(jsonComment.replies, currUser);
    }
  });
}

function createComment(jsonComment) {
  const comment = document.createElement('li');
  comment.classList.add('comment');
  comment.classList.add('bg-white');
  comment.id = jsonComment.id;

  comment.appendChild(createCommentVoter(jsonComment));
  comment.appendChild(createCommentAvatar(jsonComment));
  comment.appendChild(createCommentText(jsonComment));
  comment.appendChild(createCommentReply(jsonComment));

  if (jsonComment.replyingTo !== undefined) {
    comment.classList.add('comment--reply')
    text = comment.querySelector('.comment_text p');
    replySpan = document.createElement('span');
    replySpan.classList.add('replying-to_text')
    replySpan.textContent = `@${jsonComment.replyingTo} `;
    text.prepend(replySpan);
  }

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
  replyBtn.classList.add('comment_btn');

  const replyIcon = document.createElement('img');
  replyIcon.src = 'images/icon-reply.svg';

  const replyText = document.createElement('p');
  replyText.textContent = 'Reply';

  replyBtn.appendChild(replyIcon);
  replyBtn.appendChild(replyText);

  return replyBtn;
}

function createCommentEdit(jsonObject) {
  const editBtn = document.createElement('button');
  editBtn.classList.add('comment_edit');
  editBtn.classList.add('comment_btn');
  
  const editIcon = document.createElement('img');
  editIcon.src = 'images/icon-edit.svg';

  const editText = document.createElement('p');
  editText.textContent = 'Edit';

  editBtn.appendChild(editIcon);
  editBtn.appendChild(editText);

  return editBtn;
}

function createCommentDel(jsonObject) {
  const delBtn = document.createElement('button');
  delBtn.classList.add('comment_del');
  delBtn.classList.add('comment_btn');
  
  const delIcon = document.createElement('img');
  delIcon.src = 'images/icon-delete.svg';

  const delText = document.createElement('p');
  delText.textContent = 'Delete';

  delBtn.appendChild(delIcon);
  delBtn.appendChild(delText);

  return delBtn;
}