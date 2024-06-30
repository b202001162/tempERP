package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import student_application_project.model.Video;

public interface VideoRepo extends MongoRepository<Video,String> {
}
