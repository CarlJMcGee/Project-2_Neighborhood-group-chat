const router = require("express").Router();
const { Comment, Neighborhood, Post, User } = require("../../models");
const Filter = require("bad-words");
const censor = new Filter();

// The `/api/posts` endpoint

// get all posts
router.get("/", (req, res) => {
  // find all posts
  Post.findAll({
    attributes: ["id", "title", "content", "user_id"],
    // Including associated comments and neighborhood data
    include: [
      // include original poster's data
      {
        model: User,
        as: "OP",
        attributes: {
          exclude: ["password"],
        },
      },
      // Including associated comments data
      {
        model: Comment,
        attributes: ["content"],
        include: {
          model: User,
          as: "commenter",
          attributes: {
            exclude: ["password"],
          },
        },
      },
    ],
  })
    .then((databasePostData) => {
      if (!databasePostData) {
        // Sending a status 400 message to the user if no Post is found
        res.status(400).json(`Sorry, No posts have been found!`);

        // Sending the post to the user if there is any
        return;
      }
      // Converting data to json format
      res.json(databasePostData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  // Find post by ID
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "content", "user_id"],
    // Including associated comments and neighborhood data
    include: [
      // include original poster's data
      {
        model: User,
        as: "OP",
        attributes: {
          exclude: ["password"],
        },
      },
      // Including associated comments data
      {
        model: Comment,
        attributes: ["content"],
        include: {
          model: User,
          as: "commenter",
          attributes: {
            exclude: ["password"],
          },
        },
      },
    ],
  })
    .then((databasePostData) => {
      if (!databasePostData) {
        // Sending a status 400 message to the user if post with the given id is not found
        res
          .status(400)
          .json(
            `Sorry, No post with id =>: ${req.params.id} has been found! Please check your input and try again!`
          );

        // Sending the post to the user if post with the given id is found
        return;
      }
      // Converting data to json format
      res.json(databasePostData);
    })
    // Sending a status 500 to the user if the server encountered an unexpected condition that prevented it from fulfilling the request.
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Create new post
router.post("/", (req, res) => {
  // Create a new post

  "id", "title", "content", "user_id";
  /* req.body will look like the following
      {
        "title": "title goes here",
        "content": "content goes here",
        "user_id": "user_id goes here" (enventually the user_id will be taken from the session data),
      }
    */

  if (censor.isProfane(req.body.title) || censor.isProfane(req.body.content)) {
    res.status(400).json({
      message: `Post title or content contains unacceptable language. Please use PG language and try again :)`,
      code: `bad language`,
    });
    return;
  }

  Post.create({
    title: req.body.title,
    content: req.body.content,
    user_id: req.session.userId,
    neighborhood_id: req.session.neighborhoodId,
  })
    .then((databasePostData) => {
      res
        .status(200)
        .json(`Post ${req.body.title} has been successfully created!`);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Edit post
router.put("/:id", (req, res) => {
  if (censor.isProfane(req.body.title) || censor.isProfane(req.body.content)) {
    res.status(400).json({
      message: `Post title or content contains unacceptable language. Please use PG language and try again :)`,
      code: `bad language`,
    });
    return;
  }

  // Update a post by its id value
  Post.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((databasePostData) => {
      if (!databasePostData) {
        res
          .status(400)
          .json(
            `Sorry, No post with id =>: ${req.params.id} has been found! Please check your input and try again!`
          );
        return;
      }

      res.json(
        `post with id =>: ${
          req.params.id
        } has been successfully changed to  ${JSON.stringify(req.body)}`
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Delete a post
router.delete("/:id", (req, res) => {
  // Delete a post by its id value

  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((databasePostData) => {
      // Sending a status 404 message to the user if no post with the given id is found
      if (!databasePostData) {
        res
          .status(404)
          .json(
            `Sorry, No post with id ${req.params.id} has been found! Please check your input and try again!`
          );
        return;
      }
      res.json(
        `post with id =>: ${req.params.id} has been successfully removed`
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
