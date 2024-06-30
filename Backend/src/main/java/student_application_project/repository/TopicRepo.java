package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import student_application_project.model.Topic;

public interface TopicRepo extends MongoRepository<Topic,String> {
}
