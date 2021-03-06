const editPostFormHandler = async (e) => {
  e.preventDefault();

  const post_text = document
    .querySelector('textarea[name="post-body"]')
    .value.trim();

  const post_title = document.querySelector("#title-edit").value.trim();

  const post_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 2
  ];

  if (post_text) {
    try {
      const response = await fetch(`/api/posts/${post_id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: post_title,
          content: post_text,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resBody = await response.json();

      if (response.ok) {
        document.location.replace(`/post/${post_id}`);
      } else {
        if (resBody.code === "bad language") {
          if (document.querySelector(".err")) {
            return;
          }
          var badLang = document.createElement("p");
          badLang.className = "err";
          badLang.innerHTML = resBody.message;
          badLang.style.color = "#f00000";
          badLang.style.fontWeight = "normal";
          badLang.style.textDecorationLine = "none";
          badLang.style.margin = "0";
          badLang.style.padding = "0";
          document.querySelector("#edit-post-form").append(badLang);
          return;
        }

        alert(response.statusText);
      }
    } catch (err) {
      if (err) throw err;
    }
  }
};

const newPostFormHandler = async (e) => {
  e.preventDefault();

  const post_text = document
    .querySelector('textarea[name="post-body"]')
    .value.trim();

  const post_title = document.querySelector("#title-create").value.trim();

  if (post_text) {
    try {
      const response = await fetch(`/api/posts/`, {
        method: "POST",
        body: JSON.stringify({
          title: post_title,
          content: post_text,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resBody = await response.json();

      if (response.ok) {
        document.location.replace(`/dashboard`);
      } else {
        if (resBody.code === "bad language") {
          var badLang = document.createElement("p");
          badLang.className = "err";
          badLang.innerHTML = resBody.message;
          badLang.style.color = "#f00000";
          badLang.style.fontWeight = "normal";
          badLang.style.textDecorationLine = "none";
          badLang.style.margin = "0";
          badLang.style.padding = "0";
          document.querySelector("#create-post-form").append(badLang);
          return;
        }
        alert(response.statusText);
      }
    } catch (err) {
      if (err) throw err;
    }
  }
};

if (document.querySelector("#edit-post-form")) {
  document
    .querySelector("#edit-post-form")
    .addEventListener("submit", editPostFormHandler);
}

if (document.querySelector("#create-post-form")) {
  document
    .querySelector("#create-post-form")
    .addEventListener("submit", newPostFormHandler);
}
