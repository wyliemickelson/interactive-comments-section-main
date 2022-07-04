fetch('data.json').then(function (response) {
  return response.json();
}).then(function (obj) {
  createAllComments(obj);
}).catch (function (error) {
  console.error('Something went wrong retrieving the JSON file.');
  console.error(error);
})

let currentUser = null;

class Comment {
  constructor(id, content, createdAt, score, user, replies = [], replyingTo = undefined) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.score = score;
    this.user = user;
    this.replies = replies;
    this.replyingTo = replyingTo;
  }

  id() { return this.id; }
  content() { return this.content; }
  createdAt() { return this.createdAt; }
  score() { return this.score; }
  user() { return this.user; }
  replies() { return this.replies; }
  replyingTo() {return this.replyingTo; }

  toString() {
    return JSON.stringify(self);
  }
}

function createAllComments(jsonObject) {
  if (currentUser == null) {
    currentUser = jsonObject.currentUser;
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
    if (!Array.isArray(jsonObject.replies)) {
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
  comment.classList.add('comment');
  comment.classList.add('bg-white');
  comment.id = jsonComment.id;

  comment.appendChild(createCommentVoter(jsonComment));
  comment.appendChild(createCommentAvatar(jsonComment));
  comment.appendChild(createCommentText(jsonComment));
  comment.appendChild(createCommentReply(jsonComment));

  if (jsonComment.user.username == currentUser.username) {
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

  replyBtn.addEventListener('click', replyComment);

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

  delBtn.addEventListener('click', delComment);

  return delBtn;
}

function addComment() {
  let text = document.getElementById('newCommentInput');
  if (text.value != "") {
    c = new Comment('5', text.value, 'now', '0', currentUser);
    domComment = createComment(c);
    document.getElementById('comment-list').appendChild(domComment);
    text.value = "";
  }
}

function delComment(btn) {
  comment = this.parentElement.parentElement;
  comment.remove();
}

function replyComment() {
  replySection = document.getElementById('newCommentSection');
  newReplySection = replySection.cloneNode(true);
  newReplySection.classList.add('reply-section');
  newReplySection.id = 'newReplySection';
  newReplySection.querySelector('#newCommentInput').removeAttribute('id');
  newReplySection.querySelector('#newCommentBtnText').textContent = "REPLY";
  this.parentElement.after(newReplySection);
}

window.onload = function() {
  let newComment = document.getElementById("newCommentBtn");
  let text = document.getElementById('newCommentInput')
  newComment.addEventListener("click", addComment);
  text.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      newComment.click();
    }
  })
}