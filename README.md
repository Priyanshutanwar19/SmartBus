# 🚌 SmartBus - Online Bus Booking Platform

A modern, responsive web application for booking bus tickets online. Built with React.js and designed to provide a seamless booking experience across all devices.

## 🌟 Live Demo

**[View Live Site](https://smartbusbypriyanshutanwar.netlify.app)**

## ✨ Features

### 🎯 Core Features
- **Smart Bus Search**: Easy-to-use search form with city selection and date picker
- **Interactive Seat Selection**: Visual seat map for choosing preferred seats
- **Multi-step Booking Process**: Smooth flow from search to ticket confirmation
- **Ticket Management**: View and manage your bookings
- **PDF Ticket Download**: Download tickets as PDF for offline access
- **Real-time Pricing**: Dynamic fare calculation based on distance and operator

### 🎨 User Experience
- **Fully Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Mobile-First Approach**: Touch-friendly design for mobile users
- **Fast Loading**: Optimized performance with lazy loading
- **Accessibility**: Screen reader friendly with proper ARIA labels

### 🚀 Advanced Features
- **AI-Powered Support**: Integrated chat support with Gemini AI
- **Popular Destinations**: Quick access to trending routes
- **Top Operators**: Showcase of trusted bus operators
- **Special Offers**: Coupon codes and promotional deals
- **Live Distance Calculation**: Real-time route distance using OpenStreetMap API

## 🛠️ Technologies Used

### Frontend
- **React.js 19.1.0** - Modern React with latest features
- **React Router DOM 7.6.2** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **HTML2Canvas** - Screenshot functionality for tickets
- **jsPDF** - PDF generation for tickets

### APIs & Services
- **Gemini AI API** - Chat support functionality
- **OpenStreetMap API** - Real-time distance calculation
- **OSRM Routing API** - Route optimization

### Deployment
- **Netlify** - Hosting and continuous deployment
- **GitHub** - Version control and CI/CD

## 📱 Mobile Responsiveness

The application is fully optimized for mobile devices with:
- Responsive navigation with hamburger menu
- Touch-friendly buttons and form elements
- Mobile-optimized bus listings (cards instead of tables)
- Adaptive hero section with proper badge visibility
- Full-screen support chat on mobile

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Priyanshutanwar19/SmartBus.git
   cd SmartBus/smartbus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 🌐 Deployment

The project is deployed on Netlify with automatic deployments from GitHub:

1. **Automatic Deployment**: Any push to the main branch triggers a new deployment
2. **Manual Deployment**: Use Netlify CLI for manual deployments
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=build
   ```

## 📁 Project Structure

```
smartbus/
├── public/
│   ├── images/          # Static images and logos
│   └── index.html       # Main HTML file
├── src/
│   ├── components/      # Reusable React components
│   │   ├── BusList.js
│   │   ├── BusSearchForm.js
│   │   ├── Header.js
│   │   ├── HeroSlider.js
│   │   ├── PopularDestinations.js
│   │   ├── SupportButton.js
│   │   └── TopOperators.js
│   ├── pages/           # Page components
│   │   ├── Home.js
│   │   ├── ManageBooking.js
│   │   ├── PassengerDetails.js
│   │   ├── SeatSelection.js
│   │   └── TicketSummary.js
│   ├── data/            # Static data files
│   │   ├── destinations.json
│   │   ├── offers.json
│   │   └── operators.json
│   ├── App.js           # Main App component
│   └── index.js         # Entry point
└── package.json         # Dependencies and scripts
```

## 🎯 Key Components

### BusSearchForm
- City dropdown selection with search functionality
- Date picker with minimum date validation
- Swap button for quick route reversal
- Responsive grid layout

### BusList
- Mobile-friendly card layout
- Desktop table view
- Real-time fare calculation
- Offer integration with copy functionality

### HeroSlider
- Auto-rotating image carousel
- Feature badges with animations
- Responsive text sizing
- Gradient overlays

### SupportButton
- AI-powered chat support
- Quick reply buttons
- Full-screen mobile experience
- Real-time message handling

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### API Keys Required
- **Gemini AI API**: For chat support functionality
- **OpenStreetMap**: For distance calculations (free tier available)

## 📊 Performance

- **Bundle Size**: Optimized with code splitting
- **Loading Speed**: Lazy loading for images and components
- **Mobile Performance**: Touch-optimized interactions
- **SEO Friendly**: Meta tags and proper structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Priyanshu Tanwar**
- GitHub: [@Priyanshutanwar19](https://github.com/Priyanshutanwar19)
- LinkedIn: [Priyanshu Tanwar](https://www.linkedin.com/in/priyanshu-tanwar/)

## 🙏 Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- Netlify for seamless deployment
- OpenStreetMap for free mapping services
- Gemini AI for intelligent chat support

## 📞 Support

For support, email support@smartbus.com or use the in-app chat support.

---

⭐ **Star this repository if you found it helpful!** 