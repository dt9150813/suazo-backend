from PyPDF2 import PdfFileWriter, PdfFileReader
import io
import sys
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import json
print('# Python script started')
print(sys.argv[1])
lines = sys.stdin.readlines()
parsed = (sys.argv[1])
data = json.loads(lines[0])
print(len(data['ownerList']))
print('# gettin packet')
packet = io.BytesIO()
print('# create a new PDF with Reportlab')
can = canvas.Canvas(packet, pagesize=letter)
# can.setFont(self, "Times-Roman", 11)
print('# start editing pdf')
can.drawString(195, 630, data['businessName'])  # Owner name as sys.argv[1]
can.drawString(195, 600, data['businessStreet'])    # Write address
can.drawString(381, 600, data['businessCity'])  # Write city
can.drawString(500, 600, data['businessState']) # Write state
can.drawString(537, 600, data['businessZipcode'])   # Write zipcode
can.drawString(40, 563, data['ownerList'][data['primaryOwnerIndex']]['firstName'])
can.drawString(150, 534, data['ownerList'][data['primaryOwnerIndex']]['street'])
can.drawString(45, 508, data['ownerList'][data['primaryOwnerIndex']]['city'])
can.drawString(510, 508, data['ownerList'][data['primaryOwnerIndex']]['zipcode'])
can.drawString(138, 452, data['ownerList'][0]['firstName'])
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
    can.drawString(138, 353, data['ownerList'][2]['firstName'])
    can.drawString(457, 353, "Position of #3")
    can.drawString(138, 329, data['ownerList'][2]['street'])
    can.drawString(350, 329, data['ownerList'][2]['city'])
    can.drawString(500, 329, data['ownerList'][2]['state'])
    can.drawString(537, 329, data['ownerList'][2]['zipcode'])
if len(data['ownerList']) > 3:
    can.drawString(138, 300, data['ownerList'][3]['firstName'])
    can.drawString(457, 300, "Position of #4")
    can.drawString(138, 276, data['ownerList'][3]['street'])
    can.drawString(350, 276, data['ownerList'][3]['city'])
    can.drawString(500, 276, data['ownerList'][3]['state'])
    can.drawString(537, 276, data['ownerList'][3]['zipcode'])
can.drawString(140, 238, "X")
can.drawString(140, 218, "X")
can.drawString(314, 222, "Duration")
can.drawString(120, 200, "Optional purpose")
can.drawString(184.5, 145, "X")  # Female yes
can.drawString(255.5, 142, "X")  # Female no
can.drawString(184.5, 129, "X")  # Minority yes
can.drawString(255.5, 126, "X")  # Minority no
can.drawString(404, 130, "Specification")
print('# finish editing pdf')
can.save()
print('# canvas saved')
print('# move to the beginning of the StringIO buffer')
packet.seek(0)
new_pdf = PdfFileReader(packet)
print('# read your existing PDF')
existing_pdf = PdfFileReader(open("test.pdf", "rb"))
output = PdfFileWriter()
print('# add the "watermark" (which is the new pdf) on the existing page')
page = existing_pdf.getPage(0)
page.mergePage(new_pdf.getPage(0))
output.addPage(page)
print('# finally, write "output" to a real file')
outputStream = open(f"../tmp/{sys.argv[1]}_Certificate_of_Organization.pdf", "wb")
output.write(outputStream)
outputStream.close()
print('# script done')