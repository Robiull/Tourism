###**Tourism**  

###🌍**Overview**  
The Tourism project is a full-stack web application designed to streamline travel planning and tour management. Built with Node.js, Express, Mongoose, and Pug, it integrates Mapbox for location-based services, Stripe for secure payments, and SendGrid for email notifications. The application supports user authentication, tour management, bookings, reviews, and favorite tours, catering to both regular users and administrators.

###🚀**Features**  
Explore Destinations: Discover popular tourist attractions with detailed information.  
Travel Planning: Tools to organize trips, including itineraries and bookings.  
User-Friendly Interface: Responsive design for seamless use on desktop and mobile devices.  
(Note: Replace with actual features of your project or remove if not applicable.)

🔒**Authentication and Authorization**  
Sign Up: Create a new account with email and password.  
Log In/Out: Secure login and logout functionality.  
Password Management: Update or reset passwords via email (powered by nodemailer and SendGrid).  
User Profile: Update username, photo, email, password, and other details.  
User Roles: Regular user, admin, lead guide, and guide with role-based access control.

🗺️ **Tour Manage**  
Create Tours: Admin and lead guides can create new tours.  
View Tours: All users can browse available tours with Mapbox-powered location data.  
Update Tours: Admin and lead guides can edit tour details.  
Delete Tours: Admin and lead guides can remove tours.

🛒**Booking System**  
Book Tours: Regular users can book tours with secure payments via Stripe.  
No Duplicate Bookings: Users cannot book the same tour twice.  
View Bookings: Regular users can view their booked tours; admin/lead guides can view all bookings.  
Manual Booking: Admin and lead guides can create bookings manually without payment.  
Edit/Delete Bookings: Admin and lead guides can modify or cancel bookings.

⭐**Reviews**  
Write Reviews: Regular users can submit reviews for tours they've booked.  
View Reviews: All users can see reviews for each tour.  
Edit/Delete Reviews: Regular users can modify or delete their own reviews; admins can delete any review.  
No Duplicate Reviews: Users cannot review the same tour twice.

💳 **Payment**  
Credit Card Payments:# Secure payment processing for tour bookings via Stripe.

🛠️**Technologies Used**   
  **Backend:** Node.js, Express, Mongoose (MongoDB)  
  **Frontend:** Pug (template engine)

🛤️**APIs:**   
*Mapbox:* For interactive maps and location-based tour visualization  
*Stripe:* For secure credit card payments  
*SendGrid:* For email notifications (e.g., password reset, booking confirmations)  
*Database:* MongoDB  *Other:* RESTful API, JWT for authentication

🎮**Usage**   
*Browse Tours:* Access the homepage to view all tours with Mapbox-powered maps.  

🤝**User Actions:**  
Sign up or log in to book tours, write reviews, or add tours to favorites.  
Use the profile page to update personal details or reset passwords.

🤝**Admin/Lead Guide Actions:**  
Manage tours and bookings via the admin dashboard.  
Manually create or edit bookings without payment.  
Payment: Book tours using credit card payments processed securely via Stripe.  
Email Notifications: Receive booking confirmations and password reset emails via SendGrid.

🛤️**API Endpoints**  

🔒**Authentication:**  
```POST /api/users/signup: Register a new user  
```POST /api/users/login: Log in a user
```PATCH /api/users/updateMe: Update user profile
```POST /api/users/forgotPassword: Request password reset

❤️**Tours:**
```GET /api/tours: List all tours
```POST /api/tours: Create a tour (admin/lead guide)
```PATCH /api/tours/:id: Update a tour (admin/lead guide)
```DELETE /api/tours/:id: Delete a tour (admin/lead guide)

🛒**Bookings:**
```POST /api/bookings: Book a tour (regular user)
```GET /api/bookings: View all bookings (admin/lead guide) or user’s bookings
```PATCH /api/bookings/:id: Edit a booking (admin/lead guide)

⭐**Reviews**:  ```POST /api/reviews: Write a review (regular user)
```GET /api/reviews/:tourId: View reviews for a tour
```PATCH /api/reviews/:id: Edit a review (regular user)
