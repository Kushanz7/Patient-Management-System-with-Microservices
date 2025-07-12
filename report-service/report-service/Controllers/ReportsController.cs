using Microsoft.AspNetCore.Mvc;

namespace report_service.Controllers
{
    public class ReportsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
