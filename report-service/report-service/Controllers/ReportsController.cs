using CsvHelper;
using Microsoft.AspNetCore.Mvc;
using report_service.Data;
using System.Formats.Asn1;
using System.Globalization;
using System.Text;

namespace report_service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ReportDbContext _db;

        public ReportsController(ReportDbContext db) => _db = db;

        [HttpGet("total-registered")]
        public long Total() => _db.PatientEvents.Count(p => p.EventType == "PATIENT_CREATED");

        [HttpGet("daily")]
        public IActionResult DailyReport()
        {
            var report = _db.PatientEvents
                .Where(e => e.EventType == "PATIENT_CREATED")
                .GroupBy(e => e.ReceivedAt.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Date)
                .ToList();

            return Ok(report);
        }

        [HttpGet("export-csv")]
        public IActionResult ExportCsv()
        {
            var records = _db.PatientEvents.ToList();
            using var writer = new StringWriter();
            using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);
            csv.WriteRecords(records);
            return File(Encoding.UTF8.GetBytes(writer.ToString()), "text/csv", "report.csv");
        }
    }

}
