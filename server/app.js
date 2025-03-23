const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const hpp = require("hpp");

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const examRoutes = require("./routes/exam.routes");
const classroomRoutes = require("./routes/classroom.routes");
const assignmentRoutes = require("./routes/assignment.routes");
const notificationRoutes = require("./routes/notification.routes");
const statsRoutes = require("./routes/stats.routes");

// Import middleware
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

// Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
	max: process.env.NODE_ENV === "development" ? 1000 : 100, // 1000 requests in development, 100 in production
	windowMs: process.env.NODE_ENV === "development" ? 60 * 1000 : 60 * 60 * 1000, // 1 minute in development, 1 hour in production
	message: "Too many requests from this IP, please try again later!",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all routes except stats in development
if (process.env.NODE_ENV === "development") {
	app.use("/api", (req, res, next) => {
		if (req.path.startsWith("/api/stats")) {
			next();
		} else {
			limiter(req, res, next);
		}
	});
} else {
	app.use("/api", limiter);
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
	hpp({
		whitelist: [
			"role",
			"status",
			"gender",
			"search",
			"sortBy",
			"sortOrder",
			"page",
			"limit",
		],
	})
);

// CORS
app.use(cors());

// Compression
app.use(compression());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/stats", statsRoutes);

// 404 handler
app.all("*", (req, res, next) => {
	const err = new Error(`Can't find ${req.originalUrl} on this server!`);
	err.statusCode = 404;
	next(err);
});

// Error handler
app.use(errorHandler);

module.exports = app;
