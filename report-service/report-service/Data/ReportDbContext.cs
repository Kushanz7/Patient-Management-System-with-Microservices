using Microsoft.EntityFrameworkCore;
using report_service.Models;
using System.Collections.Generic;

namespace report_service.Data
{
    public class ReportDbContext : DbContext
    {
        public ReportDbContext(DbContextOptions<ReportDbContext> opts) : base(opts) { }

        public DbSet<PatientEventEntity> PatientEvents { get; set; }
    }

}
