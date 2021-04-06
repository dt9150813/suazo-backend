# This Python script takes data input from the node server,
# prints the data on an empty Utah certificate of organization form,
# and save the file as [businessName]_Certificate_of_Organization.pdf

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
mailing = True if sys.argv[2] == "true" else False
print('# getting packet')
packet = io.BytesIO()
print('# create a new PDF with Reportlab')
can = canvas.Canvas(packet, pagesize=letter)
can.setFont('public-sans', 11)
print('# start editing pdf')
can.drawString(195, 630, data['businessName'])  # Print business name
can.drawString(195, 600, data['businessStreet'])    # Print business streeet
can.drawString(381, 600, data['businessCity'])  # Print business city
can.drawString(500, 600, "UT")  # Print hardcoded UT as this is a UT certificate of organization
can.drawString(537, 600, data['businessZipcode'])   # Print business zipcode
can.drawString(40, 563, data['ownerList'][data['primaryOwnerIndex']]['firstName'] + " " + data['ownerList'][data['primaryOwnerIndex']]['lastName'])
can.drawString(150, 534, data['ownerList'][data['primaryOwnerIndex']]['street'])
can.drawString(45, 508, data['ownerList'][data['primaryOwnerIndex']]['city'])
can.drawString(510, 508, data['ownerList'][data['primaryOwnerIndex']]['zipcode'])
can.drawString(138, 452, data['ownerList'][0]['firstName'] + " " + data['ownerList'][0]['lastName'])
can.drawString(457, 452, "Position of #1")
can.drawString(138, 428, data['ownerList'][0]['street'])
can.drawString(350, 428, data['ownerList'][0]['city'])
can.drawString(500, 428, data['ownerList'][0]['state'])
can.drawString(537, 428, data['ownerList'][0]['zipcode'])
if len(data['ownerList']) > 1:
    can.drawString(138, 407, data['ownerList'][1]['firstName'] + " " + data['ownerList'][1]['lastName'])
    can.drawString(457, 407, "Position of #2")
    can.drawString(138, 383, data['ownerList'][1]['street'])
    can.drawString(350, 383, data['ownerList'][1]['city'])
    can.drawString(500, 383, data['ownerList'][1]['state'])
    can.drawString(537, 383, data['ownerList'][1]['zipcode'])
if len(data['ownerList']) > 2:
    can.drawString(138, 353, data['ownerList'][2]['firstName'] + " " + data['ownerList'][2]['lastName'])
    can.drawString(457, 353, "Position of #3")
    can.drawString(138, 329, data['ownerList'][2]['street'])
    can.drawString(350, 329, data['ownerList'][2]['city'])
    can.drawString(500, 329, data['ownerList'][2]['state'])
    can.drawString(537, 329, data['ownerList'][2]['zipcode'])
if len(data['ownerList']) > 3:
    can.drawString(138, 300, data['ownerList'][3]['firstName'] + " " + data['ownerList'][3]['lastName'])
    can.drawString(457, 300, "Position of #4")
    can.drawString(138, 276, data['ownerList'][3]['street'])
    can.drawString(350, 276, data['ownerList'][3]['city'])
    can.drawString(500, 276, data['ownerList'][3]['state'])
    can.drawString(537, 276, data['ownerList'][3]['zipcode'])
# can.drawString(140, 238, "X") # Item 6 perpetual check
# can.drawString(140, 218, "X") # Item 6 duration check
# can.drawString(314, 222, "Duration") # Item 6 duration specification
# can.drawString(120, 200, "Optional purpose") # Item 7 purpose
if data['ownerGender'] == "female":
    can.drawString(185, 146, "X")  # Female yes
else:
    can.drawString(256.5, 142.5, "X")  # Female no
if data['ownerRace'] not in ["white", "preferNotToSay"]:
    can.drawString(185, 130, "X")  # Minority yes
else:
    can.drawString(256.5, 126.5, "X")  # Minority no
# can.drawString(404, 130, "Specification") # Minority specification
print('# finish editing pdf')
can.save()
print('# canvas saved')
print('# move to the beginning of the StringIO buffer')
packet.seek(0)
new_pdf = PdfFileReader(packet)
print('# read your existing PDF')
if mailing:
    print("# mailing is True")
    existing_pdf = PdfFileReader(open("coo_mail_test.pdf", "rb"))
    output = PdfFileWriter()
    print('# add the "watermark" (which is the new pdf) on the existing page')
    page = existing_pdf.getPage(0)
    output.addPage(page)
    page = existing_pdf.getPage(1)
    page.mergePage(new_pdf.getPage(0))
    output.addPage(page)
    # existing_pdf = PdfFileReader(open("coo_mail.pdf", "rb"))
    # output = PdfFileWriter()
    # print('# add the "watermark" (which is the new pdf) on the existing page')
    # page = existing_pdf.getPage(0)
    # output.addPage(page)
    # page = existing_pdf.getPage(1)
    # page.mergePage(new_pdf.getPage(0))
    # output.addPage(page)
    # page = existing_pdf.getPage(2)
    # output.addPage(page)
else:
    print("# mailing is False")
    existing_pdf = PdfFileReader(open("coo.pdf", "rb"))
    output = PdfFileWriter()
    print('# add the "watermark" (which is the new pdf) on the existing page')
    page = existing_pdf.getPage(0)
    page.mergePage(new_pdf.getPage(0))
    output.addPage(page)
    page = existing_pdf.getPage(1)
    output.addPage(page)
print('# finally, write "output" to a real file')
businessNameModified = str(data['businessName']).replace(" ", "_")  # Replace space in the business name with underscores to avoid file name error
outputStream = open(f"../tmp/{businessNameModified}_Certificate_of_Organization.pdf", "wb")
output.write(outputStream)
outputStream.close()
print('# script done')