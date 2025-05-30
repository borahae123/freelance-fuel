const clients = [
  {
    name: "Maithili Ishra",
    phone: "+91 9876543210",
    work: "Website Design",
    email: "maithili@example.com",
    amount: "₹25,000",
    company: "Ishra Solutions Pvt. Ltd.",
    details: "Complete website design for portfolio, responsive layout, UI/UX optimization, and SEO setup."
  },
  {
    name: "Ravi Verma",
    phone: "+91 7896541230",
    work: "Logo and Branding",
    email: "ravi.verma@example.com",
    amount: "₹10,000",
    company: "Verma Textiles",
    details: "Logo design, color palette and typography guidelines for textile business."
  },
  {
    name: "Anjali Mehta",
    phone: "+91 9123456780",
    work: "Content Writing",
    email: "anjali.mehta@example.com",
    amount: "₹15,000",
    company: "BlogBytes Media",
    details: "15 blog posts for lifestyle niche, keyword research, and SEO optimization."
  },
  {
    name: "Karan Thakur",
    phone: "+91 9988776655",
    work: "App UI Design",
    email: "karan.t@example.com",
    amount: "₹30,000",
    company: "Thakur Tech",
    details: "UI design for fitness tracking mobile app (Android + iOS)."
  },
  {
    name: "Priya Nair",
    phone: "+91 9001122334",
    work: "Social Media Kit",
    email: "priya.nair@example.com",
    amount: "₹8,000",
    company: "Nair Accessories",
    details: "Design of highlight icons, post templates, and banners for Instagram."
  },
  {
    name: "Sahil Joshi",
    phone: "+91 9870001122",
    work: "Marketing Campaign",
    email: "sahil.j@example.com",
    amount: "₹40,000",
    company: "EventSpark",
    details: "Email marketing campaign, social media promotion and analytics setup for event launch."
  },
  {
    name: "Neha Kapoor",
    phone: "+91 8887776661",
    work: "Landing Page",
    email: "neha.kapoor@example.com",
    amount: "₹12,000",
    company: "Kapoor Consultancy",
    details: "Landing page design for client acquisition with form integrations."
  },
  {
    name: "Aarav Bansal",
    phone: "+91 9988991122",
    work: "eCommerce Setup",
    email: "aarav.b@example.com",
    amount: "₹50,000",
    company: "Bansal Footwear",
    details: "Complete Shopify store setup including product listing, payment gateway and branding."
  }
];

const tableBody = document.querySelector("#client-table-body");
const detailSection = document.querySelector(".client-detail");
const detailContent = document.querySelector("#client-detail-content");

// Populate the table
clients.forEach((client, index) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><a href="#" class="client-link" data-index="${index}">${client.name}</a></td>
    <td>${client.phone}</td>
    <td>${client.work}</td>
    <td>${client.email}</td>
    <td>${client.amount}</td>
  `;
  tableBody.appendChild(row);
});

// Handle click
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("client-link")) {
    e.preventDefault();
    const client = clients[e.target.dataset.index];
    detailSection.style.display = "block";
    detailContent.innerHTML = `
      <h2>${client.name}</h2>
      <p><strong>Phone:</strong> ${client.phone}</p>
      <p><strong>Email:</strong> ${client.email}</p>
      <p><strong>Company:</strong> ${client.company}</p>
      <p><strong>Work:</strong> ${client.work}</p>
      <p><strong>Details:</strong> ${client.details}</p>
      <p><strong>Amount Paid:</strong> ${client.amount}</p>
    `;
  }
});
