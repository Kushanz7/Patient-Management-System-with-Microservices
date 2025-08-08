using System.Collections.Generic;

namespace report_service.Models
{
    public class PatientEventEntity
    {
        public int Id { get; set; }
        public string PatientId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string EventType { get; set; }
        public DateTime ReceivedAt { get; set; }
    }

}
