var json = [{"name":"Kevin Chen", 
            "email":"ningchen227@gmail.com", 
            "transcripts":"transcript.mp3",
            "phone_number":"412-259-3558", 
            "summaries":"summary.txt"},

            {"name":"Patrick Soisson", 
            "email":"psoysauce@gmail.com", 
            "transcripts":"transcript.mp3", 
            "phone_number":"832-710-6350",
            "summaries":"summary.txt"}];

findCustomer("412-259-3558");

function findCustomer(customer)
{
    var found = false;

    for(var i = 0; i < json.length; i++)
    {
        if(json[i].phone_number == customer)
        {
            found = true;
            document.write("Customer found!" + "\n");
            document.write("Name: " + json[i].name + "\n");
            document.write("E-mail: " + json[i].email + "\n");
        }
        
    }

    if(found == false)
        document.write("Customer not found!");
}