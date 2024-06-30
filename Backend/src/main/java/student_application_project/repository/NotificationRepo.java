package student_application_project.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import student_application_project.model.Notifications;

import java.util.List;

public interface NotificationRepo extends MongoRepository<Notifications, String> {
    @Query("{ 'receiverEmail' : ?0 }")
    public List<Notifications> findByReceiverEmail(String email);

    @Query("{ 'email' : ?0 }")
    public List<Notifications> findByEmail(String email);
}
