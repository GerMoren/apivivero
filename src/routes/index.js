const { Router } = require("express");
const router = Router();
const categoryRouter = require("./category.js");
const productRouter = require("./product.js");
const searchRouter = require("./search.js");
const userRouter = require("./user.js");
const ordersRouter = require("./orders.js");
const authRouter = require("./auth.js");
const resetRouter = require("./reset.js")
// load each router on a route
// i.e: router.use('/auth', authRouter);

router.use('/auth', authRouter);
router.use("/products/category", categoryRouter);
router.use("/products", productRouter);
router.use("/search", searchRouter);
router.use("/users", userRouter);
router.use("/orders", ordersRouter);
router.use("/reset", resetRouter)

module.exports = router;
