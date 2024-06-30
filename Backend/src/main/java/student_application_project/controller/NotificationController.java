package student_application_project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import student_application_project.model.Notifications;
import student_application_project.repository.FacultyRepo;
import student_application_project.repository.NotificationRepo;
import student_application_project.repository.StudentApplicationProjectRepo;
import student_application_project.repository.TArepo;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private CourseController courseController;

    @Autowired
    private NotificationRepo notificationRepo;

    @Autowired
    private FacultyRepo facultyRepo;

    @Autowired
    private StudentApplicationProjectRepo studentRepo;

    @Autowired
    private TArepo taRepo;

    @GetMapping("/getAllNotificationsByEmail")
    public ResponseEntity<?> getAllNotificationsByEmail(@RequestParam String email) {
        try {
            List<Notifications> notifications = notificationRepo.findByEmail(email);
            return new ResponseEntity<>(notifications, null, HttpStatus.OK);
        } catch(Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addNotification")
    public ResponseEntity<?> addNotification(@RequestBody Notifications notification) {
        try {
            String notificationId = courseController.createId(notification.getSenderEmail(), notification.getReceiverEmail());
            notification.setId(notificationId);
//            Notifications notification = new Notifications(senderEmail, receiverEmail, message);
            notificationRepo.save(notification);
            return new ResponseEntity<>(notification, null, HttpStatus.OK);
        } catch(Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/deleteNotification")
    public ResponseEntity<?> deleteNotification(@RequestParam String id) {
        try {
            notificationRepo.deleteById(id);
            return new ResponseEntity<>("Notification deleted", null, HttpStatus.OK);
        } catch(Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getNotificationById")
    public ResponseEntity<?> getNotificationById(@RequestParam String id) {
        try {
            Optional<Notifications> notificationOptional = notificationRepo.findById(id);
            if(notificationOptional.isPresent()) {
                Notifications notification = notificationOptional.get();
                return new ResponseEntity<>(notification, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Notification not present", null, HttpStatus.OK);
            }
        } catch(Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
