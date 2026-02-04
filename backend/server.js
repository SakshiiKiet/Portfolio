const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(allowed => origin.includes(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Schemas
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'unread', enum: ['unread', 'read', 'replied'] },
  createdAt: { type: Date, default: Date.now }
});

const visitorSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  page: String,
  referrer: String,
  country: String,
  timestamp: { type: Date, default: Date.now }
});

const projectViewSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  views: { type: Number, default: 0 },
  uniqueVisitors: [String],
  lastViewed: { type: Date, default: Date.now }
});

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  readTime: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribed: { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: Date
});

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  image: String,
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  blogPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogPost', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  comment: { type: String, required: true },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Models
const Contact = mongoose.model('Contact', contactSchema);
const Visitor = mongoose.model('Visitor', visitorSchema);
const ProjectView = mongoose.model('ProjectView', projectViewSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const Newsletter = mongoose.model('Newsletter', newsletterSchema);
const Testimonial = mongoose.model('Testimonial', testimonialSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Email Configuration (optional)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  console.log('✅ Email service configured');
} else {
  console.log('⚠️  Email service not configured (EMAIL_USER/EMAIL_PASS missing)');
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio API is running' });
});

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }
    
    const contact = new Contact({
      name,
      email,
      subject,
      message
    });
    
    await contact.save();
    
    // Send email notification (if configured)
    if (transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
      }
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully! I\'ll get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

// Newsletter subscription
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }
    
    // Check if already subscribed
    let subscriber = await Newsletter.findOne({ email });
    
    if (subscriber) {
      if (subscriber.subscribed) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already subscribed' 
        });
      } else {
        subscriber.subscribed = true;
        subscriber.subscribedAt = new Date();
        subscriber.unsubscribedAt = null;
        await subscriber.save();
      }
    } else {
      subscriber = new Newsletter({ email });
      await subscriber.save();
    }
    
    // Send welcome email (if configured)
    if (transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        // Email to subscriber
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: '🎉 Welcome to Sakshi Maan\'s Newsletter!',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 40px 20px;">
                <tr>
                  <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                      
                      <!-- Header with Gradient -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #ff6b4a 0%, #ff7c5c 25%, #14b8a6 75%, #0d9488 100%); padding: 50px 40px; text-align: center;">
                          <div style="font-size: 60px; margin-bottom: 10px;">🎉</div>
                          <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                            Welcome Aboard!
                          </h1>
                          <p style="color: rgba(255,255,255,0.95); font-size: 18px; margin: 15px 0 0 0; font-weight: 500;">
                            Thanks for joining my community
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Main Content -->
                      <tr>
                        <td style="padding: 50px 40px;">
                          <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                            Hey there! 👋
                          </h2>
                          
                          <p style="color: #475569; font-size: 17px; line-height: 1.7; margin: 0 0 25px 0;">
                            I'm absolutely <strong>thrilled</strong> to have you here! You've just joined an amazing community of developers, creators, and tech enthusiasts.
                          </p>
                          
                          <!-- What You'll Get Box -->
                          <div style="background: linear-gradient(135deg, #fef3f2 0%, #ecfdf5 100%); border-left: 4px solid #ff7c5c; padding: 30px; border-radius: 12px; margin: 30px 0;">
                            <h3 style="color: #1e293b; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
                              📬 What You'll Receive:
                            </h3>
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding: 12px 0;">
                                  <span style="font-size: 24px; margin-right: 12px;">✨</span>
                                  <span style="color: #334155; font-size: 16px; line-height: 1.6;"><strong>Latest Articles</strong> on web development, AI, and tech insights</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 12px 0;">
                                  <span style="font-size: 24px; margin-right: 12px;">🚀</span>
                                  <span style="color: #334155; font-size: 16px; line-height: 1.6;"><strong>Project Launches</strong> with behind-the-scenes updates</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 12px 0;">
                                  <span style="font-size: 24px; margin-right: 12px;">💡</span>
                                  <span style="color: #334155; font-size: 16px; line-height: 1.6;"><strong>Tips & Tricks</strong> to level up your coding skills</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 12px 0;">
                                  <span style="font-size: 24px; margin-right: 12px;">🎁</span>
                                  <span style="color: #334155; font-size: 16px; line-height: 1.6;"><strong>Exclusive Content</strong> available only for subscribers</span>
                                </td>
                              </tr>
                            </table>
                          </div>
                          
                          <!-- Promise Box -->
                          <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center;">
                            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0;">
                              <strong>My Promise:</strong> No spam, ever! Only valuable content that helps you grow as a developer. Your inbox stays clean. 🧹
                            </p>
                          </div>
                          
                          <!-- Subscription Confirmation -->
                          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; border-radius: 12px; margin: 30px 0; text-align: center; border: 1px solid #93c5fd;">
                            <p style="color: #1e40af; font-size: 15px; margin: 0 0 8px 0; font-weight: 500;">
                              ✓ Subscription Confirmed
                            </p>
                            <p style="color: #3b82f6; font-size: 17px; margin: 0; font-weight: 600;">
                              ${email}
                            </p>
                          </div>
                          
                          <p style="color: #475569; font-size: 17px; line-height: 1.7; margin: 25px 0 0 0;">
                            Stay tuned for amazing content! 🎯
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Signature -->
                      <tr>
                        <td style="padding: 0 40px 40px 40px;">
                          <div style="background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%); padding: 30px; border-radius: 12px; border-left: 4px solid #14b8a6;">
                            <p style="color: #0f766e; margin: 0 0 8px 0; font-size: 15px; font-weight: 500;">
                              Best regards,
                            </p>
                            <p style="color: #14b8a6; font-weight: 700; font-size: 24px; margin: 0 0 5px 0;">
                              Sakshi Maan
                            </p>
                            <p style="color: #5eead4; font-size: 16px; margin: 0; font-weight: 500;">
                              Full Stack Developer 💻
                            </p>
                          </div>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                          <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0;">
                            You received this email because you subscribed to Sakshi Maan's newsletter at<br>
                            <a href="https://sakshi-maan-portfolio.netlify.app" style="color: #14b8a6; text-decoration: none; font-weight: 500;">sakshi-maan-portfolio.netlify.app</a>
                          </p>
                        </td>
                      </tr>
                      
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        });
        
        // Notification email to you
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: '🔔 New Newsletter Subscription!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1e293b;">New Subscriber Alert 🎉</h2>
              <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #14b8a6;">
                <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 10px 0 0 0;"><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p style="color: #64748b; margin-top: 20px; font-size: 14px;">
                Total subscribers are growing! 🚀
              </p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Welcome email error:', emailError);
      }
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe. Please try again later.' 
    });
  }
});

// Get all blog posts
app.get('/api/blog/posts', async (req, res) => {
  try {
    const { category, search, limit = 10, page = 1 } = req.query;
    
    let query = { published: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-content');
    
    const total = await BlogPost.countDocuments(query);
    
    res.json({ 
      success: true, 
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Fetch blog posts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch blog posts' 
    });
  }
});

// Get single blog post
app.get('/api/blog/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const post = await BlogPost.findOne({ slug, published: true });
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found' 
      });
    }
    
    // Increment views
    post.views += 1;
    await post.save();
    
    res.json({ success: true, post });
  } catch (error) {
    console.error('Fetch blog post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch blog post' 
    });
  }
});

// Create blog post (protected - add authentication in production)
app.post('/api/blog/posts', async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, featured } = req.body;
    
    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields missing' 
      });
    }
    
    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
    
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200) + ' min read';
    
    const post = new BlogPost({
      title,
      slug,
      excerpt,
      content,
      category,
      tags: tags || [],
      featured: featured || false,
      readTime
    });
    
    await post.save();
    
    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create blog post' 
    });
  }
});

// Like blog post
app.post('/api/blog/posts/:slug/like', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const post = await BlogPost.findOne({ slug });
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found' 
      });
    }
    
    post.likes += 1;
    await post.save();
    
    res.json({ success: true, likes: post.likes });
  } catch (error) {
    console.error('Like blog post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to like post' 
    });
  }
});

// Add comment to blog post
app.post('/api/blog/posts/:slug/comments', async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, email, comment } = req.body;
    
    if (!name || !email || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    const post = await BlogPost.findOne({ slug });
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found' 
      });
    }
    
    const newComment = new Comment({
      blogPostId: post._id,
      name,
      email,
      comment
    });
    
    await newComment.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Comment submitted for approval' 
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add comment' 
    });
  }
});

// Get approved testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, testimonials });
  } catch (error) {
    console.error('Fetch testimonials error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch testimonials' 
    });
  }
});

// Submit testimonial
app.post('/api/testimonials', async (req, res) => {
  try {
    const { name, role, company, text, rating } = req.body;
    
    if (!name || !role || !company || !text) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields missing' 
      });
    }
    
    const testimonial = new Testimonial({
      name,
      role,
      company,
      text,
      rating: rating || 5
    });
    
    await testimonial.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Testimonial submitted for approval' 
    });
  } catch (error) {
    console.error('Submit testimonial error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit testimonial' 
    });
  }
});

// Track visitor
app.post('/api/track/visitor', async (req, res) => {
  try {
    const { page, referrer } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    const visitor = new Visitor({
      ip,
      userAgent,
      page: page || '/',
      referrer: referrer || 'direct'
    });
    
    await visitor.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    res.status(500).json({ success: false });
  }
});

// Track project views
app.post('/api/track/project/:projectName', async (req, res) => {
  try {
    const { projectName } = req.params;
    const ip = req.ip || req.connection.remoteAddress;
    
    let projectView = await ProjectView.findOne({ projectName });
    
    if (!projectView) {
      projectView = new ProjectView({
        projectName,
        views: 1,
        uniqueVisitors: [ip]
      });
    } else {
      projectView.views += 1;
      if (!projectView.uniqueVisitors.includes(ip)) {
        projectView.uniqueVisitors.push(ip);
      }
      projectView.lastViewed = new Date();
    }
    
    await projectView.save();
    
    res.json({ 
      success: true, 
      views: projectView.views,
      uniqueVisitors: projectView.uniqueVisitors.length
    });
  } catch (error) {
    console.error('Project tracking error:', error);
    res.status(500).json({ success: false });
  }
});

// Get analytics data
app.get('/api/analytics', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [
      totalVisitors,
      todayVisitors,
      totalContacts,
      projectViews,
      blogViews,
      newsletterSubscribers
    ] = await Promise.all([
      Visitor.countDocuments(),
      Visitor.countDocuments({ timestamp: { $gte: today } }),
      Contact.countDocuments(),
      ProjectView.find(),
      BlogPost.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]),
      Newsletter.countDocuments({ subscribed: true })
    ]);
    
    const pageViews = await Visitor.aggregate([
      {
        $group: {
          _id: '$page',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const visitorTrend = await Visitor.aggregate([
      {
        $match: { timestamp: { $gte: sevenDaysAgo } }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.json({
      success: true,
      analytics: {
        totalVisitors,
        todayVisitors,
        totalContacts,
        projectViews,
        blogViews: blogViews[0]?.total || 0,
        newsletterSubscribers,
        pageViews,
        visitorTrend
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch analytics' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
});

module.exports = app;
