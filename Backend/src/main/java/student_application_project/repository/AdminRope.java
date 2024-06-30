package student_application_project.repository;

import org.springframework.boot.autoconfigure.kafka.KafkaProperties;
import org.springframework.data.mongodb.repository.MongoRepository;
import student_application_project.model.Admin;

public interface AdminRope extends MongoRepository<Admin, String> {
}
