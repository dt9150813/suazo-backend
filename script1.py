from PyPDF2 import PdfFileWriter, PdfFileReader
import io
import sys
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import webbrowser
import time

packet = io.BytesIO()
# create a new PDF with Reportlab
can = canvas.Canvas(packet, pagesize=letter)
# can.setFont(self, "Times-Roman", 11)
can.drawString(195, 630, sys.argv[1]) #Company name as sys.argv[1]
can.drawString(195, 600, sys.argv[2]) #Write address
can.drawString(381, 600, "Bryce Canyon City") #Write city
can.drawString(500, 600, "UT") #Write state
can.drawString(537, 600, "84120") #Write zipcode
can.drawString(60, 563, "Registered Agent name")
can.drawString(140, 534, "Address of the agent")
can.drawString(45, 508, "Agent city")
can.drawString(510, 508, "84120")
can.drawString(138, 452, "Firstname and lastname of #1")
can.drawString(457, 452, "Position of #1")
can.drawString(138, 428, "The full street address of #1")
can.drawString(350, 428, "The city of #1")
can.drawString(500, 428, "#1")
can.drawString(537, 428, "84120")
can.drawString(138, 407, "Firstname and lastname of #2")
can.drawString(457, 407, "Position of #2")
can.drawString(138, 383, "The full street address of #2")
can.drawString(350, 383, "The city of #2")
can.drawString(500, 383, "#2")
can.drawString(537, 383, "84120")
can.drawString(138, 353, "Firstname and lastname of #3")
can.drawString(457, 353, "Position of #3")
can.drawString(138, 329, "The full street address of #3")
can.drawString(350, 329, "The city of #3")
can.drawString(500, 329, "#3")
can.drawString(537, 329, "84120")
can.drawString(138, 300, "Firstname and lastname of #4")
can.drawString(457, 300, "Position of #4")
can.drawString(138, 276, "The full street address of #4")
can.drawString(350, 276, "The city of #4")
can.drawString(500, 276, "#4")
can.drawString(537, 276, "84120")
can.drawString(140, 238, "X")
can.drawString(140, 218, "X")
can.drawString(314, 222, "Duration")
can.drawString(120, 200, "Optional purpose")
can.drawString(184.5, 145, "X") #Female yes
can.drawString(255.5, 142, "X") #Female no
can.drawString(184.5, 129, "X") #Minority yes
can.drawString(255.5, 126, "X") #Minority no
can.drawString(404, 130, "Specification")
can.save()

#move to the beginning of the StringIO buffer
packet.seek(0)
new_pdf = PdfFileReader(packet)
# read your existing PDF
existing_pdf = PdfFileReader(open("test.pdf", "rb"))
output = PdfFileWriter()
# add the "watermark" (which is the new pdf) on the existing page
page = existing_pdf.getPage(0)
page.mergePage(new_pdf.getPage(0))
output.addPage(page)

# finally, write "output" to a real file
outputStream = open("destination.pdf", "wb")
output.write(outputStream)
outputStream.close()
print('file saved')
webbrowser.open_new('.\destination.pdf')
# time.sleep(30)
# os.remove('.\destination.pdf')