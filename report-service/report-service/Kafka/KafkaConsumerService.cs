using Confluent.Kafka;
using report_service.Models;
using report_service.Data;
using Google.Protobuf;
using Patient.Events; // <- if generated from proto

namespace report_service.Kafka
{
    public class KafkaConsumerService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<KafkaConsumerService> _logger;
        private const string topic = "patient";

        public KafkaConsumerService(IServiceScopeFactory scopeFactory, ILogger<KafkaConsumerService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var config = new ConsumerConfig
            {
                BootstrapServers = "kafka:9092",
                GroupId = "report-service",
                AutoOffsetReset = AutoOffsetReset.Earliest
            };

            using var consumer = new ConsumerBuilder<Ignore, byte[]>(config).Build();
            consumer.Subscribe(topic);

            while (!stoppingToken.IsCancellationRequested)
            {
                var cr = consumer.Consume(stoppingToken);

                try
                {
                    var eventMsg = PatientEvent.Parser.ParseFrom(cr.Message.Value);

                    using var scope = _scopeFactory.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<ReportDbContext>();

                    db.PatientEvents.Add(new PatientEventEntity
                    {
                        PatientId = eventMsg.PatientId,
                        Name = eventMsg.Name,
                        Email = eventMsg.Email,
                        EventType = eventMsg.EventType,
                        ReceivedAt = DateTime.UtcNow
                    });

                    await db.SaveChangesAsync();
                    _logger.LogInformation($"Saved event for patient {eventMsg.PatientId}");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Kafka consume error: {ex.Message}");
                }
            }
        }
    }

}
