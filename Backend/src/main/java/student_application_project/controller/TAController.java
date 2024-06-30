package student_application_project.controller;

import org.apache.tomcat.util.http.parser.HttpParser;
import org.springframework.beans.ExtendedBeanInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import student_application_project.model.*;
import student_application_project.repository.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TAController {
    @Autowired
    private TArepo repo;

    @Autowired
    private TArepo taRepo;

    @Autowired
    private CourseRepo courseRepo;
    @Autowired
    private NotificationRepo notificationRepo;

    @GetMapping("/getAllTAs")
    public ResponseEntity<?> getAllTAs() {
        try {
            return new ResponseEntity<>(repo.findAll(), null, HttpStatus.OK);
        } catch(Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getTA")
    public ResponseEntity<?> getTAByEmail(@RequestParam String email) {
        try {
            Optional<TA> taOptional = repo.findById(email);
            if(taOptional.isPresent()) {
                TA ta = taOptional.get();
                return new ResponseEntity<>(ta, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("TA not present", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addTA")
    public ResponseEntity<?> addTA(@RequestBody TA ta) {
        try {
            repo.save(ta);
            return new ResponseEntity<>(ta, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/TAlogin")
    public ResponseEntity<?> TAlogin(@RequestBody TA taOld) {
        try {
            Optional<TA> taOptional = repo.findById(taOld.getEmail());
            if(taOptional.isPresent()) {
                TA ta = taOptional.get();
                if(ta.getPassword().equals(taOld.getPassword())) {
                    return new ResponseEntity<>(ta, null, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Incorrect password", null, HttpStatus.OK);
                }
            } else {
                return new ResponseEntity<>("User not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public void toAddCourseToTA(TA ta, Course course) {
        try {
            if(ta.getCurrentCourses() == null) {
                ta.setCurrentCourses(new ArrayList<>());
            }
            ta.getCurrentCourses().add(course);
            taRepo.save(ta);

            TADetails taDetails = new TADetails(ta.getEmail(), ta.getName(), ta.getRating(), ta.getDomains());
            if(course.getTas() == null) {
                course.setTas(new ArrayList<>());
            }
            course.getTas().add(taDetails);
            courseRepo.save(course);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    @PostMapping("/addCourseToTA")
    public ResponseEntity<?> addCourseToTA(@RequestParam String courseId, @RequestParam String taId) {
        try {
            Optional<Course> courseOptional = courseRepo.findById(courseId);
            Optional<TA> taOptional = taRepo.findById(taId);
            if(courseOptional.isPresent() && taOptional.isPresent()) {
                Course course = courseOptional.get();
                TA ta = taOptional.get();
//                toAddCourseToTA(ta, course);
                Notifications notification = new Notifications();
                notification.setTitle("Request Sent to Professor");
                notification.setMessage("You have requested to be TA in " + course.getName());
                notification.setType(1);
                notification.setCourseId(course.getId());
                notification.setCourseName(course.getName());
                notification.setSenderName(ta.getName());
                notification.setSenderEmail(ta.getEmail());
                notification.setSenderRole("TA");
//            notification.setReceiverName(course.getProfessorName());
//            notification.setReceiverEmail(course.getProfessorEmail());
                notification.setEmail(ta.getEmail());
                notificationRepo.save(notification);

                Notifications notification1 = new Notifications();
                notification1.setTitle("Request Sent by TA");
                notification1.setMessage("TA " + ta.getName() + " has requested to be TA in " + course.getName());
                notification1.setType(2);
                notification1.setCourseId(course.getId());
                notification1.setCourseName(course.getName());
                notification1.setSenderName(ta.getName());
                notification1.setSenderEmail(ta.getEmail());
                notification1.setSenderRole("TA");
                notification1.setReceiverName(course.getFacultyEmail());
                notification1.setReceiverEmail(course.getFacultyEmail());
                notification1.setEmail(course.getFacultyEmail());
                notificationRepo.save(notification1);
                List<String> notifications = ta.getRequestNotifications();
                if(notifications == null) {
                    notifications = new ArrayList<>();
                }
                notifications.add(notification1.getId());
                ta.setRequestNotifications(notifications);
                taRepo.save(ta);
//                notification.setEmail(course.getFacultyEmail());
//                notificationRepo.save(notification);
                return new ResponseEntity<>("Pass", null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Failed", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/acceptTARequest")
    public ResponseEntity<?> acceptTARequest(@RequestParam String notificationId, @RequestParam String taEmail, @RequestParam String email, @RequestParam String courseId) {
        try {
            Optional<Notifications> notificationOptional = notificationRepo.findById(notificationId);
            Optional<TA> taOptional = taRepo.findById(taEmail);
            Optional<Course> courseOptional = courseRepo.findById(courseId);
            if(notificationOptional.isPresent() && taOptional.isPresent() && courseOptional.isPresent()) {
                Notifications notification = notificationOptional.get();
                TA ta = taOptional.get();
                Course course = courseOptional.get();
                if(notification.getRequestAcceptance()) {
                    return new ResponseEntity<>("Already Accepted", null, HttpStatus.OK);
                }
                notification.setTitle("Request Accepted");
                notification.setMessage("Your request to be TA in " + course.getName() + " has been accepted");
                notification.setType(1);
                notification.setRequestAcceptance(true);
                notificationRepo.save(notification);
                Notifications notifications = new Notifications();
                notifications.setTitle("Request Accepted");
                notifications.setMessage("Your request to be TA in " + course.getName() + " has been accepted");
                notifications.setType(1);
                notifications.setCourseId(course.getId());
                notifications.setCourseName(course.getName());
                notifications.setSenderName(course.getFacultyEmail());
                notifications.setSenderEmail(course.getFacultyEmail());
                notifications.setSenderRole("Faculty");
                notifications.setReceiverName(ta.getName());
                notifications.setReceiverEmail(ta.getEmail());
                notifications.setReceiverRole("TA");
                notifications.setEmail(ta.getEmail());
                notificationRepo.save(notifications);
                List <String> notifications1 = ta.getRequestNotifications();
                for (String s : notifications1) {
                    if(s.equals(notificationId)) {
                        notifications1.remove(s);
                        break;
                    }
                    Optional<Notifications> notificationS = notificationRepo.findById(s);
                    if (notificationS.isPresent()) {
                        Notifications notification1 = notificationS.get();
                        notification1.setType(1);
                        notification1.setTitle("TA not Available");
                        notification1.setMessage("TA " + ta.getName() + " is not available.");
                        notification1.setRequestRejection(true);
                        notificationRepo.save(notification1);
                    }
                }
                ta.setIsAvailable(false);
                toAddCourseToTA(ta, course);
                return new ResponseEntity<>("Accepted", null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Failed", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/rejectTARequest")
    public ResponseEntity<?> rejectTARequest(@RequestParam String notificationId, @RequestParam String taEmail, @RequestParam String courseId ) {
        try {
            Optional<Notifications> notificationOptional = notificationRepo.findById(notificationId);
            Optional<TA> taOptional = taRepo.findById(taEmail);
            Optional<Course> courseOptional = courseRepo.findById(courseId);
            if(notificationOptional.isPresent() && taOptional.isPresent() && courseOptional.isPresent()) {
                Notifications notification = notificationOptional.get();
                TA ta = taOptional.get();
                Course course = courseOptional.get();
                if(notification.getRequestAcceptance()) {
                    return new ResponseEntity<>("Already Accepted", null, HttpStatus.OK);
                }
                notification.setTitle("Request Rejected");
                notification.setMessage("Your request to be TA in " + course.getName() + " has been rejected");
                notification.setType(1);
                notification.setRequestAcceptance(false);
                notification.setRequestRejection(true);
                notificationRepo.save(notification);
                Notifications notifications = new Notifications();
                notifications.setTitle("Request Rejected");
                notifications.setMessage("Your request to be TA in " + course.getName() + " has been Rejected!");
                notifications.setType(1);
                notifications.setCourseId(course.getId());
                notifications.setCourseName(course.getName());
                notifications.setSenderName(course.getFacultyEmail());
                notifications.setSenderEmail(course.getFacultyEmail());
                notifications.setSenderRole("Faculty");
                notifications.setReceiverName(ta.getName());
                notifications.setReceiverEmail(ta.getEmail());
                notifications.setReceiverRole("TA");
                notifications.setRequestRejection(true);
                notifications.setEmail(ta.getEmail());
                notificationRepo.save(notifications);
                List <String> notifications1 = ta.getRequestNotifications();
                for (String s : notifications1) {
                    if(s.equals(notificationId)) {
                        notifications1.remove(s);
                        break;
                    }
                    Optional<Notifications> notificationS = notificationRepo.findById(s);
                    if (notificationS.isPresent()) {
                        Notifications notification1 = notificationS.get();
                        if (notification1.getCourseId().equals(course.getId())) {
                            notification1.setType(1);
                            notification1.setTitle("TA not Available");
                            notification1.setMessage("TA " + ta.getName() + " is not available.");
                            notification1.setRequestRejection(true);
                            notificationRepo.save(notification1);
                        }
                    }
                }
//                toAddCourseToTA(ta, course);
                return new ResponseEntity<>("Accepted", null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Failed", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
