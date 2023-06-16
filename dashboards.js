async function getJSONData() {
    const response = await fetch("https://rwmbrtwcuogykekepsfg.supabase.co/rest/v1/dashboards_and_tools?select=*&apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3bWJydHdjdW9neWtla2Vwc2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY3OTcyMjQsImV4cCI6MjAwMjM3MzIyNH0.SlxIj9CN17Y36gYD9husbYUZMX1mjTArKwu9mBGxxRQ");
    const jsonData = await response.json();
    render(jsonData)
  }

getJSONData()

function render(val) {
    console.log(val[0])

}