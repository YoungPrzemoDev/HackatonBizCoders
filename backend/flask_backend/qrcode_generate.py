import qrcode

# Define the URL for the app
url = "http://172.19.0.128:8081"

# Generate QR Code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Save the QR code as an image
img = qr.make_image(fill_color="black", back_color="white")
img.save("app_qr_code.png")

print("QR code generated and saved as 'app_qr_code.png'")