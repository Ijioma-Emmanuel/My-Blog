import express from "express";
import bodyparser from "body-parser";
import multer from "multer";
import methodOverride from "method-override";

const upload = multer({ dest: "public/uploads/" });
const app = express();
const port = 3001;

app.locals.date = new Date().getFullYear();

app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

const posts = [];


function createPost(req) {
    const { title, author, category, content } = req.body;

    const date = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const time = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });

    const todaysDate = `${date} · ${time}`;

    const newPost = {
        title: title,
        author: author,
        category: category,
        date: todaysDate,
        content: content,
        image: req.file?.path.replace("public", "") || null,
        id: posts.length + 1
    };

    return newPost;
}


app.get("/", (req, res) => {

    const latestPosts = posts.slice(0, 4);

    res.render("index.ejs", {
        latestPosts
    });

});


app.get("/create", (req, res) => {
    res.render("create.ejs", {
        post: null
    });
});


app.get("/about", (req, res) => {
    res.render("about.ejs");
});


app.get("/all-post", (req, res) => {
    res.render("all-post.ejs", {
        posts: posts
    });
});


app.get("/single-post/:id", (req, res) => {

    const postId = Number(req.params.id);

    const post = posts.find(post => post.id === postId);

    res.render("single-post.ejs", {
        post: post
    });

});


app.post("/create-post", upload.single("imgInput"), (req, res) => {

    const newPost = createPost(req);

    posts.unshift(newPost);

    res.redirect("/");
});


app.get("/search", (req, res) => {

    const query = req.query.q;

    if (!query) {
        return res.redirect("/");
    }

    const searchResults = posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.category.toLowerCase().includes(query.toLowerCase()) ||
        post.author.toLowerCase().includes(query.toLowerCase())
    );

    res.render("all-post", {
        posts: searchResults,
        searchQuery: query
    });
});


app.get("/filter", (req, res) => {

    if (!req.query.category) {
        return res.redirect("/");
    }

    const category = req.query.category.toLowerCase();

    const filteredPosts = posts.filter(
        post => post.category.toLowerCase() === category
    );

    res.render("all-post", {
        posts: filteredPosts,
        category: req.query.category
    });
});


app.get("/edit-post/:id", (req, res) => {

    const post = posts.find(
        post => post.id === Number(req.params.id)
    );

    if (!post) {
        return res.status(404).send("Post not found");
    }

    res.render("create", {
        post: post
    });
});


app.post("/edit-post/:id", upload.single("imgInput"), (req, res) => {

    const postId = Number(req.params.id);

    const postIndex = posts.findIndex(
        post => post.id === postId
    );

    if (postIndex === -1) {
        return res.status(404).send("Post not found");
    }

    const oldPost = posts[postIndex];

    const { title, author, category, content } = req.body;

    const date = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const time = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
    });

    const todaysDate = `${date} · ${time}`;

    const updatedPost = {
        id: oldPost.id,
        title: title,
        author: author,
        category: category,
        date: todaysDate,
        content: content,
        image: req.file
            ? req.file.path.replace("public", "")
            : oldPost.image
    };

    posts[postIndex] = updatedPost;

    res.redirect(`/single-post/${postId}`);
});


app.delete("/delete-post/:id", (req, res) => {

    const postId = Number(req.params.id);

    const postIndex = posts.findIndex(
        post => post.id === postId
    );

    if (postIndex === -1) {
        return res.status(404).send("Post not found");
    }

    posts.splice(postIndex, 1);

    res.redirect("/");
});



app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


