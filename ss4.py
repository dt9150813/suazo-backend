# This Python script takes data input from the node server,
# prints the data on an empty IRS SS4 form,
# and save the file as [businessName]_ss4.pdf

from PyPDF2 import PdfFileWriter, PdfFileReader
import io
import sys
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import json

print('# Python script started')
pdfmetrics.registerFont(TTFont('public-sans', 'public-sans.regular.ttf'))
data = json.loads(sys.argv[1])
print('# gettin packet')
packet = io.BytesIO()
print('# create a new PDF with Reportlab')
can = canvas.Canvas(packet, pagesize=letter)
can.setFont('public-sans', 11)
print('# start editing pdf')
can.drawString(55, 687, data['ownerList'][data['primaryOwnerIndex']]['firstName'] + " " + data['ownerList'][data['primaryOwnerIndex']]['lastName'])   #1
can.drawString(55, 665, data['businessName'])   #2
can.drawString(300, 665, data['ownerList'][data['primaryOwnerIndex']]['firstName'] + " " + data['ownerList'][data['primaryOwnerIndex']]['lastName'])  #3
can.drawString(55, 640, data['businessStreet'])   #4a
can.drawString(55, 615, data['businessCity'] + ", " + data['businessState'] + " " + data['businessZipcode'])   #4b
can.drawString(300, 640, data['ownerList'][data['primaryOwnerIndex']]['street'])  #5a
can.drawString(300, 615, data['ownerList'][data['primaryOwnerIndex']]['city'] + ", " + data['ownerList'][data['primaryOwnerIndex']]['state'] + " " + data['ownerList'][data['primaryOwnerIndex']]['zipcode'])  #5b
can.drawString(55, 590, 'USA')   #6
can.drawString(55, 567, 'businessName')   #7a
can.drawString(340, 567, 'businessName')  #7b
can.drawString(256, 543, "x")   # 8a Yes
can.drawString(494, 530, "x")   # 8c Yes
can.drawString(62, 506.5, "x")  # 9a Sole Proprietor check
# can.drawString(157, 506.5, '12121222121')   # 9a Sole Proprietor mark-SSN
# can.drawString(62, 494.5, "x")  # 9a Partner check
can.drawString(62, 387, "x")    # 10 Started new business check
can.drawString(62, 373, data["businessType"])  # 10 Started new business specification
# can.drawString(160, 313.5, '99/99/9999')    # 11
# can.drawString(492, 325, "December")   # 12 Month
can.drawString(98, 254, "0")   # 13 Agricultural
can.drawString(185, 254, "0")   # 13 Household
can.drawString(278, 254, "0")   # 13 Other
can.drawString(419, 255, "x")   # 14 Check
if data["businessType"] == 'healthCare':
    can.drawString(321, 219, "x")   # 16 Health care & social assistance
elif data["businessType"] == 'wholesaleAgent':
    can.drawString(451, 219, "x")   # 16 Wholesale-agent/broker
elif data["businessType"] == 'construction':
    can.drawString(62, 207, "x")    # 16 Construction
elif data["businessType"] == 'rentalLeasing':
    can.drawString(126.5, 207, "x")  # 16 Rental & leasing
elif data["businessType"] == 'transport':
    can.drawString(206, 207, "x")   # 16 Transportation & warehousing
elif data["businessType"] == 'accomodation':
    can.drawString(321, 207, "x")   # 16 Accommodation & food service
elif data["businessType"] == 'wholesaleOther':
    can.drawString(451, 207, "x")   # 16 Wholesale-other
elif data["businessType"] == 'retail':
    can.drawString(537, 207, "x")   # 16 Retail
elif data["businessType"] == 'realEstate':
    can.drawString(62, 195, "x")    # 16 Real estate
elif data["businessType"] == 'manufacturing':
    can.drawString(126.5, 195, "x")  # 16 Manufacturing
elif data["businessType"] == 'finance':
    can.drawString(206, 195, "x")   # 16 Finance & insurance
else:
    can.drawString(321, 195, "x")   # 16 Other
    # can.drawString(404, 195, "Specification")   # 16 Other specification
can.drawString(400, 159, "x")   # 18 No
# can.drawString(435, 62, "80142224000")  # Applicant's telephone number
print('# finish editing pdf')
can.save()
print('# canvas saved')
print('# move to the beginning of the StringIO buffer')
packet.seek(0)
new_pdf = PdfFileReader(packet)
print('# read your existing PDF')
existing_pdf = PdfFileReader(open("ss4.pdf", "rb"))
output = PdfFileWriter()
print('# add the "watermark" (which is the new pdf) on the existing page')
page = existing_pdf.getPage(0)
page.mergePage(new_pdf.getPage(0))
output.addPage(page)
print('# finally, write "output" to a real file')
businessNameModified = str(data['businessName']).replace(" ", "_")  # Replace space in the business name with underscores to avoid file name error
outputStream = open(f"../tmp/{businessNameModified}_ss4.pdf", "wb")
output.write(outputStream)
outputStream.close()
print('# script done')