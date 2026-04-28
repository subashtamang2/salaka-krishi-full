import jsPDF from "jspdf";
import type { OrderInterface } from "../schema/schema";

const COMPANY_DETAILS = {
    name: "Salaka Krishi",
    address: "Kathmandu, Nepal",
    phone: "+977-9851013269",
    email: "info@salakakrishi.com",
    website: "www.salakakrishi.com"
};

export const generateInvoicePDF = async (order: OrderInterface) => {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(40, 167, 69); // Salaka Krishi Green
    doc.setFont("helvetica", "bold");
    doc.text(COMPANY_DETAILS.name, margin, 30);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(COMPANY_DETAILS.address, margin, 37);
    doc.text(`Phone: ${COMPANY_DETAILS.phone}`, margin, 42);
    doc.text(`Email: ${COMPANY_DETAILS.email}`, margin, 47);

    // --- Invoice Info ---
    doc.setFontSize(26);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth - margin - 50, 35);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: ${order.orderNumber}`, pageWidth - margin - 50, 42);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, pageWidth - margin - 50, 47);

    // --- Billing Details ---
    doc.setDrawColor(230);
    doc.line(margin, 55, pageWidth - margin, 55);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", margin, 65);

    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.setFont("helvetica", "normal");
    doc.text(order.fullName, margin, 72);
    doc.text(order.address, margin, 77);
    doc.text(`Phone: ${order.phoneNumber}`, margin, 82);

    // --- Table Header ---
    const tableHeaderY = 95;
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, tableHeaderY - 7, pageWidth - (margin * 2), 10, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Product", margin + 5, tableHeaderY);
    doc.text("Price", margin + 80, tableHeaderY);
    doc.text("Qty", margin + 110, tableHeaderY);
    doc.text("Total", pageWidth - margin - 25, tableHeaderY);

    // --- Table Content ---
    let currentY = tableHeaderY + 10;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50);

    order.items.forEach((item) => {
        // Handle long product names
        const splitTitle = doc.splitTextToSize(item.name, 70);
        doc.text(splitTitle, margin + 5, currentY);
        
        doc.text(`Rs. ${item.price.toLocaleString()}`, margin + 80, currentY);
        doc.text(item.quantity.toString(), margin + 110, currentY);
        doc.text(`Rs. ${(item.price * item.quantity).toLocaleString()}`, pageWidth - margin - 25, currentY);
        
        currentY += (splitTitle.length * 6) + 2;
        
        // Horizontal line between items
        doc.setDrawColor(245);
        doc.line(margin, currentY - 4, pageWidth - margin, currentY - 4);
        currentY += 4;
    });

    // --- Totals ---
    currentY += 5;
    const totalsX = pageWidth - margin - 60;
    
    doc.setFontSize(10);
    doc.text("Subtotal:", totalsX, currentY);
    doc.text(`Rs. ${order.subTotal.toLocaleString()}`, pageWidth - margin - 5, currentY, { align: "right" });
    
    currentY += 7;
    doc.text("Delivery Fee:", totalsX, currentY);
    doc.text(`Rs. ${(order.deliveryCharge || 0).toLocaleString()}`, pageWidth - margin - 5, currentY, { align: "right" });
    
    if (order.discount) {
        currentY += 7;
        doc.text("Discount:", totalsX, currentY);
        doc.setTextColor(220, 53, 69);
        doc.text(`-Rs. ${order.discount.toLocaleString()}`, pageWidth - margin - 5, currentY, { align: "right" });
        doc.setTextColor(50);
    }
    
    currentY += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 167, 69);
    doc.text("Total:", totalsX, currentY);
    doc.text(`Rs. ${order.total.toLocaleString()}`, pageWidth - margin - 5, currentY, { align: "right" });

    // --- Footer ---
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for shopping with Salaka Krishi!", pageWidth / 2, pageWidth - margin, { align: "center" });

    // Save the PDF
    doc.save(`Invoice-${order.orderNumber}.pdf`);
};
