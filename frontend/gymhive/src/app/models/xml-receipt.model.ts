import { EmailOrderRequest } from "./email-request.model"

export function generateReceiptXml(data: EmailOrderRequest): string {

    //subtotal and total
    const subtotal = data.items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity
    }, 0)

    const total = subtotal + data.shippingCost + data.tax

    //xml header
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'

    //open root element
    xml += "<OrderReceipt>\n"

    //order information
    xml += "  <OrderInfo>\n"
    xml += `    <OrderId>${escapeXml(data.orderID)}</OrderId>\n`
    xml += `    <OrderDate>${escapeXml(String(data.orderDate))}</OrderDate>\n`
    if (data.firestoreID) {
        xml += `    <FirestoreId>${escapeXml(data.firestoreID)}</FirestoreId>\n`
    }
    xml += "  </OrderInfo>\n"

    //customer information
    xml += "  <CustomerInfo>\n"
    xml += `    <CustomerId>${escapeXml(data.customerID)}</CustomerId>\n`
    xml += `    <Name>${escapeXml(data.customerName)}</Name>\n`
    xml += `    <Email>${escapeXml(data.customerEmail)}</Email>\n`
    if (data.phone) {
        xml += `    <Phone>${escapeXml(data.phone)}</Phone>\n`
    }

    //address
    xml += "    <Address>\n"
    xml += `      <Street>${escapeXml(data.address.street)}</Street>\n`
    xml += `      <City>${escapeXml(data.address.city)}</City>\n`
    xml += `      <State>${escapeXml(data.address.state)}</State>\n`
    xml += `      <ZipCode>${escapeXml(data.address.zipCode)}</ZipCode>\n`
    xml += `      <Country>${escapeXml(data.address.country)}</Country>\n`
    xml += "    </Address>\n"

    xml += "  </CustomerInfo>\n"

    //order items
    xml += "  <Items>\n"
    data.items.forEach((item) => {
        xml += "    <Item>\n"
        xml += `      <ProductId>${escapeXml(item.product.productId!)}</ProductId>\n`
        xml += `      <Name>${escapeXml(item.product.name)}</Name>\n`
        xml += `      <Description>${escapeXml(item.product.description)}</Description>\n`
        xml += `      <Quantity>${item.quantity}</Quantity>\n`
        xml += `      <UnitPrice>${item.product.price.toFixed(2)}</UnitPrice>\n`
        xml += `      <TotalPrice>${(item.product.price * item.quantity).toFixed(2)}</TotalPrice>\n`
        xml += `      <CategoryId>${escapeXml(item.product.categoryId)}</CategoryId>\n`
        xml += `      <SubCategoryId>${escapeXml(item.product.subCategoryId)}</SubCategoryId>\n`
        xml += `      <ImageUrl>${escapeXml(item.product.imageUrl)}</ImageUrl>\n`
        xml += "    </Item>\n"
    })
    xml += "  </Items>\n"

    //pricing information
    xml += "  <Pricing>\n"
    xml += `    <Subtotal>${subtotal.toFixed(2)}</Subtotal>\n`
    xml += `    <Shipping>${data.shippingCost.toFixed(2)}</Shipping>\n`
    xml += `    <Tax>${data.tax.toFixed(2)}</Tax>\n`
    xml += `    <Total>${total.toFixed(2)}</Total>\n`
    xml += "  </Pricing>\n"

    //close root element
    xml += "</OrderReceipt>"

    return xml
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
}