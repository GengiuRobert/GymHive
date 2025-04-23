import { Injectable } from "@angular/core";
import { catchError, from, map, Observable, switchMap } from "rxjs";
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

import { EmailService } from "./email.service";

import { generateReceiptXml } from "../models/xml-receipt.model";
import { EmailOrderRequest } from "../models/email-request.model";

@Injectable({ providedIn: 'root' })
export class XMLReceiptService {

    constructor(private emailService: EmailService) { }

    public generateAndDownloadReceipt(userId: string, orderId: string): Observable<boolean> {
        return this.emailService.getOrderByUserIdAndOrderId(userId, orderId).pipe(
            map((orderData) => {
                const receiptXml = generateReceiptXml(orderData)
                this.downloadXmlFile(receiptXml, `receipt-${orderData.orderID}.xml`)
                return true
            }),
            catchError((error) => {
                console.error("Error generating receipt:", error)
                throw error
            }),
        )
    }

    public generateAndDownloadPdf(userId: string, orderId: string): Observable<boolean> {
        return this.emailService.getOrderByUserIdAndOrderId(userId, orderId).pipe(
            switchMap((orderData) => {
                return from(this.generatePdf(orderData))
            }),
            map(() => true),
        )
    }

    private async generatePdf(orderData: EmailOrderRequest): Promise<void> {
        const container = document.createElement("div")
        container.innerHTML = this.generateReceiptHtml(orderData)
        container.style.position = "absolute"
        container.style.left = "-9999px"
        container.style.top = "-9999px"
        document.body.appendChild(container)

        try {
            //wait images to load
            await new Promise((resolve) => setTimeout(resolve, 500))

            //html2canvas to convert the HTML to a canvas
            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true, //cross-origin images
                logging: false,
            })

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            })

            const imgWidth = 210
            const pageHeight = 297
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            const imgData = canvas.toDataURL("image/png")
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

            let heightLeft = imgHeight
            let position = 0

            while (heightLeft > pageHeight) {
                position = heightLeft - pageHeight
                pdf.addPage()
                pdf.addImage(imgData, "PNG", 0, -position, imgWidth, imgHeight)
                heightLeft -= pageHeight
            }

            pdf.save(`receipt-${orderData.orderID}.pdf`)
        } finally {
            document.body.removeChild(container)
        }
    }

    private generateReceiptHtml(data: EmailOrderRequest): string {
        // Calculate subtotal and total
        const subtotal = data.items.reduce((sum, item) => {
            return sum + item.product.price * item.quantity
        }, 0)

        const total = subtotal + data.shippingCost + data.tax

        // Format date
        let orderDate = data.orderDate
        try {
            const date = new Date(data.orderDate as string)
            if (!isNaN(date.getTime())) {
                orderDate = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
            }
        } catch (e) {
            console.error("Error formatting date:", e)
        }

        return `
          <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ff6b00; padding-bottom: 20px;">
              <h1 style="color: #ff6b00; margin: 0; font-size: 28px;">GYM HIVE</h1>
              <h2 style="margin: 10px 0 0;">Order Receipt</h2>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap;">
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px; color: #ff6b00;">Order Information</h3>
                <p style="margin: 0 0 5px;"><strong>Order ID:</strong> ${data.orderID}</p>
                <p style="margin: 0 0 5px;"><strong>Date:</strong> ${orderDate}</p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px; color: #ff6b00;">Customer Information</h3>
                <p style="margin: 0 0 5px;"><strong>Name:</strong> ${data.customerName}</p>
                <p style="margin: 0 0 5px;"><strong>Email:</strong> ${data.customerEmail}</p>
                ${data.phone ? `<p style="margin: 0 0 5px;"><strong>Phone:</strong> ${data.phone}</p>` : ""}
              </div>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h3 style="margin: 0 0 10px; color: #ff6b00;">Shipping Address</h3>
              <p style="margin: 0;">
                ${data.address.street}<br>
                ${data.address.city}, ${data.address.state} ${data.address.zipCode}<br>
                ${data.address.country}
              </p>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h3 style="margin: 0 0 10px; color: #ff6b00;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f4f4f4;">
                    <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Product</th>
                    <th style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">Quantity</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Unit Price</th>
                    <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.items
                .map(
                    (item) => `
                    <tr>
                      <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                        <div style="font-weight: bold;">${item.product.name}</div>
                        <div style="font-size: 12px; color: #666;">${item.product.productId}</div>
                      </td>
                      <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                      <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">$${item.product.price.toFixed(2)}</td>
                      <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">$${(item.product.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  `,
                )
                .join("")}
                </tbody>
              </table>
            </div>
            
            <div style="margin-left: auto; width: 300px;">
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0; text-align: right;">Subtotal:</td>
                  <td style="padding: 5px 0; text-align: right;">$${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; text-align: right;">Shipping:</td>
                  <td style="padding: 5px 0; text-align: right;">$${data.shippingCost.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; text-align: right;">Tax:</td>
                  <td style="padding: 5px 0; text-align: right;">$${data.tax.toFixed(2)}</td>
                </tr>
                <tr style="font-weight: bold; font-size: 18px; color: #ff6b00;">
                  <td style="padding: 10px 0; text-align: right; border-top: 2px solid #ddd;">Total:</td>
                  <td style="padding: 10px 0; text-align: right; border-top: 2px solid #ddd;">$${total.toFixed(2)}</td>
                </tr>
              </table>
            </div>
            
            <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; text-align: center; font-size: 14px; color: #666;">
              <p>Thank you for shopping with us!</p>
              <p>If you have any questions about your order, please contact our customer service team at support@gymhive-store.com or call us at +40 123 456 789.</p>
              <p style="margin-top: 20px;">&copy; 2025 GymHive Store. All rights reserved.</p>
            </div>
          </div>
        `
    }

    private downloadXmlFile(xmlContent: string, filename: string): void {
        const blob = new Blob([xmlContent], { type: "application/xml" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")

        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()

        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    }
}
