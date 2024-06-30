package student_application_project.controller;

import org.apache.coyote.Response;
import org.springframework.beans.ExtendedBeanInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.aggregation.SelectionOperators;
import org.springframework.expression.spel.ast.Assign;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import student_application_project.model.*;
import student_application_project.repository.*;

import javax.management.Notification;
import javax.swing.*;
import javax.swing.text.html.Option;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {
    @Autowired
    private CourseRepo repo;

    @Autowired
    private TArepo taRepo;

    @Autowired
    private FacultyRepo facultyRepo;

    @Autowired
    private TopicRepo topicRepo;

    @Autowired
    private MaterialRepo materialRepo;

    @Autowired
    private AssignmentRepo assignmentRepo;

    @Autowired
    private VideoRepo videoRepo;

    @Autowired
    private StudentApplicationProjectRepo studentRepo;

    @Autowired
    private AssignmentSubmissionRepo assignmentSubmissionRepo;

    @Autowired
    private StudentAssignmentSubmissionRepo studentAssignmentSubmissionRepo;

    @Autowired
    private SubmissionFileRepo submissionFilesRepo;

    @Autowired
    private NotificationRepo notificationRepo;

    @Autowired
    private TokenRepo tokenRepo;

    @Autowired
    private ResultRepo resultRepo;

    @Autowired
    private InstituteAdminRepo instituteAdminRepo;

    @GetMapping("/courses")
    public ResponseEntity<?> getAllCourses() {
        List<Course> courses = repo.findAll();
        if (courses.isEmpty()) {
            return new ResponseEntity<>("No Courses available", null, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<List<Course>>(courses, null, HttpStatus.OK);
        }
    }

    @GetMapping("/getCourse")
    public ResponseEntity<?> getCourseById(@RequestParam String Id) {
        try {
            Optional<Course> course = repo.findById(Id);
            if(course.isPresent()) {
                Course course1 = course.get();
                return new ResponseEntity<>(course1, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Course is not present", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/editCourseDetails")
    public ResponseEntity<?> editCourseDetails(@RequestBody Course course) {
        try {
            Optional<Course> courseOptional = repo.findById(course.getId());
            if(courseOptional.isPresent()) {
                Course course1 = courseOptional.get();
                course1.setName(course.getName());
                course1.setDescription(course.getDescription());
                course1.setCredits(course.getCredits());
                if(course.getIsCoreCourse() != course1.getIsCoreCourse()) {
                    System.out.println("Core Course");
                    course1.setIsCoreCourse(course.getIsCoreCourse());
                    Notifications notifications = new Notifications();
                    notifications.setCourseId(course.getId());
                    notifications.setCourseName(course1.getName());
                    notifications.setTitle("Core Course Update");
                    if(course.getIsCoreCourse())
                        notifications.setMessage("The course " + course1.getName() + " has been set as core course by the admin");
                    else
                        notifications.setMessage("The course " + course1.getName() + " has been set as elective course by the admin");
                    notifications.setReceiverEmail(course1.getFacultyEmail());
                    notifications.setReceiverName("Faculty");
                    notifications.setEmail(course1.getFacultyEmail());
                    notifications.setType(1);
                    notificationRepo.save(notifications);
                }
                if(course.getSemester() != course1.getSemester()) {
                    System.out.println("Semester");
                    Notifications notifications = new Notifications();
                    notifications.setCourseId(course.getId());
                    notifications.setCourseName(course1.getName());
                    notifications.setTitle("Semester Update");
                    notifications.setMessage("The course " + course1.getName() + " has been updated to semester " + course.getSemester());
                    notifications.setReceiverEmail(course1.getFacultyEmail());
                    notifications.setReceiverName("Faculty");
                    notifications.setEmail(course1.getFacultyEmail());
                    notifications.setType(1);
                    notificationRepo.save(notifications);
                    course1.setSemester(course.getSemester());
                }
                repo.save(course1);
                Optional<Faculties> faculties = facultyRepo.findById(course1.getFacultyEmail());
                if(faculties.isPresent()) {
                    Faculties faculties1 = faculties.get();
                    List<Course> courses = faculties1.getCurrentCourseList();
                    for(int i = 0; i<courses.size(); i++) {
                        if(Objects.equals(courses.get(i).getId(), course1.getId())) {
                            courses.remove(i);
                            break;
                        }
                    }
                    courses.add(course1);
                    faculties1.setCurrentCourseList(courses);
                    facultyRepo.save(faculties1);
                }
                return new ResponseEntity<>(course1, null,HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found!", null, HttpStatus.OK);
            }
        } catch ( Exception e ) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Course addCourse(@RequestBody Course course) {
        try {
//            course.setNumOfStudents(course.getNumOfStudents() + 1);
            String courseId = createId(course.getFacultyEmail(), course.getName());
            course.setId(courseId);
            repo.save(course);
            return course;
        } catch (Exception e) {
            return course;
        }

    }

    @GetMapping("/course/{id}")
    public ResponseEntity<?> getSingleCourse(@PathVariable("id") String id) {
        try {
            Optional<Course> courseOptional = repo.findById(id);
            if (courseOptional.isPresent()) {
                return new ResponseEntity<>(courseOptional.get(), null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No Course found with id: " + id, null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addCourseAndSetToFaculty")
    public ResponseEntity<?> addCourseAndSetToFaculty(@RequestBody Course course) {
        try {
            Optional<Faculties> faculties = facultyRepo.findById(course.getFacultyEmail());
            if(faculties.isPresent()) {
                Faculties faculty = faculties.get();
                course.setInstituteName(faculty.getInstituteName());
                course = addCourse(course);
                List<Course> newCourses = new ArrayList<>();
                if(faculty.getCurrentCourseList() == null) {
                    newCourses.add(course);
                } else {
                    newCourses = faculty.getCurrentCourseList();
                    newCourses.add(course);
                }
                faculty.setCurrentCourseList(newCourses);
                faculty.setCurrentSemesterCourses(faculty.getCurrentSemesterCourses() + 1);
                faculty.setTotalNumberOfCourses(faculty.getTotalNumberOfCourses() + 1);
                facultyRepo.save(faculty);
                Notifications notifications = new Notifications();
                notifications.setCourseId(course.getId());
                notifications.setCourseName(course.getName());
                notifications.setTitle("Course Creation");
                notifications.setMessage("You have created the course " + course.getName());
                notifications.setReceiverEmail(course.getFacultyEmail());
                notifications.setReceiverName(faculty.getName());
                notifications.setEmail(course.getFacultyEmail());
                notifications.setType(1);
                notificationRepo.save(notifications);
                return new ResponseEntity<>("Successful", null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Fail", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addTopic")
    public ResponseEntity<?> addTopic(@RequestBody Topic topic) {
        try {
            Optional<Course> courseOptional = repo.findById(topic.getCourseId());
            if(courseOptional.isPresent()) {
                Course course = courseOptional.get();
                String topicId = createId(course.getId(), topic.getName());
                topic.setId(topicId);
                List<Topic>topicsList = new ArrayList<>();
                if(course.getTopics() != null) {
                    topicsList = course.getTopics();
                }
                topicsList.add(topic);
                course.setTopics(topicsList);
                topicRepo.save(topic);
                repo.save(course);
                Notifications notifications = new Notifications();
                notifications.setCourseId(course.getId());
                notifications.setCourseName(course.getName());
                notifications.setTitle("Topic Creation");
                notifications.setMessage("You have created the topic " + topic.getName());
                notifications.setReceiverEmail(course.getFacultyEmail());
                notifications.setReceiverName(course.getInstructor());
                notifications.setEmail(course.getFacultyEmail());
                notifications.setType(1);
                notificationRepo.save(notifications);
                for(int i = 0; i<course.getStudents().size(); i++) {
                    Notifications notifications1 = new Notifications();
                    notifications1.setCourseId(course.getId());
                    notifications1.setCourseName(course.getName());
                    notifications1.setTitle("Topic Creation");
                    notifications1.setMessage("A new topic " + topic.getName() + " has been added to the course " + course.getName());
                    notifications1.setReceiverEmail(course.getStudents().get(i).getId());
                    notifications1.setReceiverName(course.getStudents().get(i).getName());
                    notifications1.setEmail(course.getStudents().get(i).getId());
                    notifications1.setType(1);
                    notificationRepo.save(notifications1);
                }
                return new ResponseEntity<>(topic, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not added!", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getTopics")
    public ResponseEntity<?> getTopics(@RequestParam String Id) {
        try {
            Optional<Course> courses = repo.findById(Id);
            if(courses.isPresent()) {
                Course course = courses.get();
                return new ResponseEntity<>(course.getTopics(), null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not present!", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getTopic")
    public ResponseEntity<?> getTopic(@RequestParam String Id) {
        try {
            Optional<Topic> topic = topicRepo.findById(Id);
            if(topic.isPresent()) {
                Topic topic1 = topic.get();
                return new ResponseEntity<>(topic1, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not present!", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addVideo")
    public ResponseEntity<?> addVideo(@RequestBody Video video) {
        try {
            Optional<Topic> topicOptional = topicRepo.findById(video.getTopicId());
            if(topicOptional.isPresent()) {
                Topic topic = topicOptional.get();
                String videoId = createId(topic.getId(), video.getName());
                video.setId(videoId);
                List<Video>videosList = new ArrayList<>();
                if(topic.getVideos() != null) {
                    videosList = topic.getVideos();
                }
                videosList.add(video);
                topic.setVideos(videosList);
                videoRepo.save(video);
                topicRepo.save(topic);
                Notifications notifications = new Notifications();
                notifications.setCourseId(topic.getCourseId());
                notifications.setCourseName(topic.getName());
                notifications.setTitle("Video Creation");
                notifications.setMessage("You have created the video " + video.getName());
                notifications.setReceiverEmail(topic.getCourseId());
                notifications.setReceiverName(topic.getName());
                notifications.setEmail(topic.getCourseId());
                notifications.setType(1);
                notificationRepo.save(notifications);
                Optional<Course> courseOptional = repo.findById(topic.getCourseId());
                if(courseOptional.isPresent()) {
                    Course course = courseOptional.get();
                    for(int i = 0; i<course.getStudents().size(); i++) {
                        Notifications notifications1 = new Notifications();
                        notifications1.setCourseId(topic.getCourseId());
                        notifications1.setCourseName(topic.getName());
                        notifications1.setTitle("Video Creation");
                        notifications1.setMessage("A new video " + video.getName() + " has been added to the topic " + topic.getName());
                        notifications1.setReceiverEmail(course.getStudents().get(i).getId());
                        notifications1.setReceiverName(course.getStudents().get(i).getName());
                        notifications1.setEmail(course.getStudents().get(i).getId());
                        notifications1.setType(1);
                        notificationRepo.save(notifications1);
                    }
                }
                return new ResponseEntity<>(video, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not added!", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getVideos")
    public ResponseEntity<?> getVideos(@RequestParam String Id) {
        try {
            Optional<Topic> topics = topicRepo.findById(Id);
            if(topics.isPresent()) {
                Topic topic = topics.get();
                return new ResponseEntity<>(topic.getVideos(), null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not present!", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addMaterial")
    public ResponseEntity<?> addMaterial(@RequestBody Material material) {
        try {
            Optional<Topic> topicOptional = topicRepo.findById(material.getTopicId());
            if(topicOptional.isPresent()) {
                Topic topic = topicOptional.get();
                String materialId = createId(topic.getId(), material.getName());
                material.setId(materialId);
                List<Material>materialsList = new ArrayList<>();
                if(topic.getMaterials() != null) {
                    materialsList = topic.getMaterials();
                }
                materialsList.add(material);
                topic.setMaterials(materialsList);
                materialRepo.save(material);
                topicRepo.save(topic);
                Optional<Course> courseOptional = repo.findById(topic.getCourseId());
                if(courseOptional.isPresent()) {
                    Course course = courseOptional.get();
                    for(int i = 0; i<course.getStudents().size(); i++) {
                        Notifications notifications1 = new Notifications();
                        notifications1.setCourseId(topic.getCourseId());
                        notifications1.setCourseName(topic.getName());
                        notifications1.setTitle("Material Creation");
                        notifications1.setMessage("A new material " + material.getName() + " has been added to the topic " + topic.getName());
                        notifications1.setReceiverEmail(course.getStudents().get(i).getId());
                        notifications1.setReceiverName(course.getStudents().get(i).getName());
                        notifications1.setEmail(course.getStudents().get(i).getId());
                        notifications1.setType(1);
                        notificationRepo.save(notifications1);
                    }
                }
                return new ResponseEntity<>(material, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not added!", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getMaterials")
    public ResponseEntity<?> getMaterials(@RequestParam String Id) {
        try {
            Optional<Topic> topics = topicRepo.findById(Id);
            if(topics.isPresent()) {
                Topic topic = topics.get();
                return new ResponseEntity<>(topic.getMaterials(), null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not present!", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public String createId(String id, String name) {
        LocalDate today = LocalDate.now(); // Get current date
        LocalTime time = LocalTime.now(); // Get current time

        String date = today.format(DateTimeFormatter.ofPattern("ddMM"));
        String timeStr = time.format(DateTimeFormatter.ofPattern("hhmmss"));
        return id + date + timeStr + name.substring(name.length() - 3);
    }

    @PostMapping("/addAssignment")
    public ResponseEntity<?> addAssignment(@RequestBody Assignment assignment) {
        try {
            Optional<Topic> topicOptional = topicRepo.findById(assignment.getTopicId());
            System.out.println("Topic Optional: " + assignment.getTopicId());
            if(topicOptional.isPresent()) {
                AssignmentSubmission assignmentSubmission = new AssignmentSubmission();
                Topic topic = topicOptional.get();
                String assignmentId = createId(topic.getId(), assignment.getName());
                assignment.setId(assignmentId);
                assignment.setCourseId(topic.getCourseId());
                assignmentSubmission.setAssignmentId(assignmentId);
                assignmentSubmission.setTopicName(topic.getName());
                assignmentSubmission.setCourseId(topic.getCourseId());
                assignmentSubmission.setStudentAssignmentSubmission(new ArrayList<>());
                assignmentSubmission.setAssignmentName(assignment.getName());
                assignmentSubmission.setMaxMarks(assignment.getMaxMarks());
                assignmentSubmissionRepo.save(assignmentSubmission);
                assignmentRepo.save(assignment);
                assignment.setId(assignmentId);
                List<Assignment>assignmentsList = new ArrayList<>();
                if(topic.getAssignments() != null) {
                    assignmentsList = topic.getAssignments();
                }
                assignmentsList.add(assignment);
                topic.setAssignments(assignmentsList);
                topicRepo.save(topic);
                Optional<Course> courseOptional = repo.findById(topic.getCourseId());
                if(courseOptional.isPresent()) {
                    Course course = courseOptional.get();
                    Notifications notifications = new Notifications();
                    notifications.setCourseId(topic.getCourseId());
                    notifications.setCourseName(topic.getName());
                    notifications.setTitle("Assignment Creation");
                    notifications.setMessage("You have created the assignment " + assignment.getName());
                    notifications.setReceiverEmail(course.getFacultyEmail());
//                    notifications.setReceiverName(topic.getName());
                    notifications.setEmail(course.getFacultyEmail());
                    notifications.setType(1);
                    notificationRepo.save(notifications);
                    for(int i = 0; i<course.getStudents().size(); i++) {
                        Notifications notifications1 = new Notifications();
                        notifications1.setCourseId(topic.getCourseId());
                        notifications1.setCourseName(topic.getName());
                        notifications1.setTitle("Assignment Creation");
                        notifications1.setMessage("A new assignment " + assignment.getName() + " has been added to the topic " + topic.getName());
                        notifications1.setReceiverEmail(course.getStudents().get(i).getId());
                        notifications1.setReceiverName(course.getStudents().get(i).getName());
                        notifications1.setEmail(course.getStudents().get(i).getId());
                        notifications1.setType(1);
                        notificationRepo.save(notifications1);
                    }
                }
                return new ResponseEntity<>(assignment, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not Present!", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/enrollCourse")
    public ResponseEntity<?> enrollCourse(@RequestParam String courseId, @RequestParam String Id) {
        try {
            Optional<Students> studentsOptional = studentRepo.findById(Id);
            Optional<Course> courseOptional = repo.findById(courseId);
            if(studentsOptional.isPresent() && courseOptional.isPresent()) {
                Students student = studentsOptional.get();
                Course course = courseOptional.get();
                course.setNumOfStudents(course.getNumOfStudents() + 1);
                StudentCustom studentCustom = new StudentCustom();
                studentCustom.setId(Id);
                studentCustom.setName(student.getFirstName() + " " + student.getLastName());
                List<StudentCustom> studentCustomList = new ArrayList<>();
                if(course.getStudents() != null) {
                    studentCustomList = course.getStudents();
                }
                Notifications notifications = new Notifications();
                notifications.setCourseId(courseId);
                notifications.setCourseName(course.getName());
                notifications.setTitle("Enrollment");
                notifications.setMessage("You have been enrolled in the course " + course.getName());
//                notifications.setNotification("You have been enrolled in the course " + course.getName());
                notifications.setReceiverEmail(student.getEmail());
                notifications.setReceiverName(student.getFirstName() + " " + student.getLastName());
                notifications.setEmail(student.getEmail());
                notifications.setType(1);
                notificationRepo.save(notifications);
                studentCustomList.add(studentCustom);
                course.setStudents(studentCustomList);
                repo.save(course);
                List<Course> courses = new ArrayList<>();
                if(student.getCourses() != null)
                    courses = student.getCourses();
                courses.add(course);
                student.setCourses(courses);
                studentRepo.save(student);
                return new ResponseEntity<>("Successful", null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Fail", null, HttpStatus.OK);
            }
        } catch (Exception e ) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAssignments")
    public ResponseEntity<?> getAssignments(@RequestParam String Id) {
        try {
            Optional<Topic> topics = topicRepo.findById(Id);
            if(topics.isPresent()) {
                Topic topic = topics.get();
                return new ResponseEntity<>(topic.getAssignments(), null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not present!", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getStudent")
    public ResponseEntity<?> getStudent(@RequestParam String Id) {
        try {
            Optional<Students> studentsOptional = studentRepo.findById(Id);
            if(studentsOptional.isPresent()) {
                return new ResponseEntity<>(studentsOptional.get(), null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getCoursesForTA")
    public ResponseEntity<?> getCoursesForTA(@RequestParam String Id) {
        try {
            Optional<TA> taOptional = taRepo.findById(Id);
            if(taOptional.isPresent()) {
                TA ta = taOptional.get();
                List<Course> courses = new ArrayList<>();
                if(ta.getCurrentCourses() != null) {
                    courses = ta.getCurrentCourses();
                }
                return new ResponseEntity<>(courses, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Assignment submission by student
    @PostMapping("/submitAssignment")
    public ResponseEntity<?> submitAssignment(@RequestBody SubmissionFiles submissionFiles, @RequestParam String assignmentId, @RequestParam String studentId, @RequestParam String assignmentName) {
        try {
            Optional<AssignmentSubmission> assignmentOptional = assignmentSubmissionRepo.findById(assignmentId);
            if(assignmentOptional.isPresent()) {
                AssignmentSubmission assignment = assignmentOptional.get();
                List<StudentAssignmentSubmission> studentAssignmentSubmissions = new ArrayList<>();
                StudentAssignmentSubmission studentAssignmentSubmission1 = new StudentAssignmentSubmission();
                if(assignment.getStudentAssignmentSubmission() != null && !assignment.getStudentAssignmentSubmission().isEmpty()) {
                    System.out.println("StudentAssignmentSubmission is not null");
                    studentAssignmentSubmissions = assignment.getStudentAssignmentSubmission();
                    boolean x = false;
                    for(StudentAssignmentSubmission studentAssignmentSubmission : studentAssignmentSubmissions) {
                        if (Objects.equals(studentAssignmentSubmission.getStudentId(), studentId)) {
                            x = true;
                            break;
                        }
                    }
                    if(!x) {
                        studentAssignmentSubmission1.setAssignmentId(assignmentId);
                        studentAssignmentSubmission1.setStudentId(studentId);
                        studentAssignmentSubmission1.setStudentName("Student");
                        studentAssignmentSubmission1.setSubmissionFiles(new ArrayList<>());
                        studentAssignmentSubmission1.setCourseId(assignment.getCourseId());
                        studentAssignmentSubmission1.setTopicName(assignment.getTopicName());
                        studentAssignmentSubmission1.setAssignmentName(assignmentName);
                        studentAssignmentSubmission1.setMaxMarks(assignment.getMaxMarks());
                        studentAssignmentSubmissions.add(studentAssignmentSubmission1);
                    }
                } else {
                    studentAssignmentSubmission1.setAssignmentId(assignmentId);
                    studentAssignmentSubmission1.setStudentId(studentId);
                    studentAssignmentSubmission1.setStudentName("Student");
                    studentAssignmentSubmission1.setSubmissionFiles(new ArrayList<>());
                    studentAssignmentSubmission1.setCourseId(assignment.getCourseId());
                    studentAssignmentSubmission1.setTopicName(assignment.getTopicName());
                    studentAssignmentSubmission1.setAssignmentName(assignmentName);
                    studentAssignmentSubmission1.setMaxMarks(assignment.getMaxMarks());
                    studentAssignmentSubmissions.add(studentAssignmentSubmission1);
                }
                System.out.println("StudentAssignmentSubmission is null");
//                    studentAssignmentSubmissions = new ArrayList<>();
//                studentAssignmentSubmissions.add(studentAssignmentSubmission1);
//                studentAssignmentSubmissions.add(submissionFiles);
//                assignment.setSubmissionFiles(studentAssignmentSubmissions);
                for (StudentAssignmentSubmission studentAssignmentSubmission : studentAssignmentSubmissions) {
                    if (Objects.equals(studentAssignmentSubmission.getStudentId(), studentId)) {
                        List<SubmissionFiles> submissionFilesList = new ArrayList<>();
                        if(studentAssignmentSubmission.getSubmissionFiles() != null) {
                            submissionFilesList = studentAssignmentSubmission.getSubmissionFiles();
                        }
                        submissionFilesList.add(submissionFiles);
                        studentAssignmentSubmission.setSubmissionFiles(submissionFilesList);
                        studentAssignmentSubmissionRepo.save(studentAssignmentSubmission);
                        break;
                    }
                }
                assignment.setStudentAssignmentSubmission(studentAssignmentSubmissions);
                assignmentSubmissionRepo.save(assignment);

                Notifications notifications = new Notifications();
//                notifications.setCourseId(assignmentId);
//                notifications.setCourseName(assignmentId);
                notifications.setTitle("Assignment Submission");
                notifications.setMessage("You have submitted the assignment " + assignmentName);
                notifications.setReceiverEmail(studentId);
                notifications.setReceiverName("Student");
                notifications.setEmail(studentId);
                notifications.setType(1);
//                notifications.setEmail(studentId);
                notificationRepo.save(notifications);
                return new ResponseEntity<>(studentAssignmentSubmissions, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getSubmissionsByAssignmentId")
    public ResponseEntity<?> getSubmissionsByAssignmentId(@RequestParam String assignmentId) {
        try {
            List<StudentAssignmentSubmission> assignmentOptional = studentAssignmentSubmissionRepo.findByAssignmentId(assignmentId);
            return new ResponseEntity<>(assignmentOptional, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getSubmissionFiles")
    public ResponseEntity<?> getSubmissionFiles(@RequestParam String assignmentId, @RequestParam String studentId) {
        try {
            Optional<StudentAssignmentSubmission> studentAssignmentSubmissionOptional = Optional.ofNullable(studentAssignmentSubmissionRepo.findByAssignmentIdAndStudentId(assignmentId, studentId));
            if(studentAssignmentSubmissionOptional.isPresent()) {
                StudentAssignmentSubmission studentAssignmentSubmission = studentAssignmentSubmissionOptional.get();
                return new ResponseEntity<>(studentAssignmentSubmission, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/evaluateAssignment")
    public ResponseEntity<?> evaluateAssignment(@RequestParam String assignmentId, @RequestParam String studentId, @RequestParam float marks) {
        try {
            Optional<StudentAssignmentSubmission> studentAssignmentSubmissionOptional = Optional.ofNullable(studentAssignmentSubmissionRepo.findByAssignmentIdAndStudentId(assignmentId, studentId));
            if(studentAssignmentSubmissionOptional.isPresent()) {
                System.out.println("StudentAssignmentSubmission is present");
                StudentAssignmentSubmission studentAssignmentSubmission = studentAssignmentSubmissionOptional.get();
                studentAssignmentSubmission.setObtainedMarks(marks);
                studentAssignmentSubmission.setIsEvaluated(true);
                studentAssignmentSubmissionRepo.save(studentAssignmentSubmission);
                // set notification for student and faculty and TAs
                Optional<Assignment> assignmentOptional = assignmentRepo.findById(assignmentId);
                if(assignmentOptional.isPresent()) {
                    System.out.println("Assignment is present");
                    Assignment assignment = assignmentOptional.get();
                    Optional<Course> courseOptional = repo.findById(assignment.getCourseId());
                    if(courseOptional.isPresent()) {
                        System.out.println("Course is present");
                        Course course = courseOptional.get();
                        Notifications notifications = new Notifications();
                        notifications.setCourseId(assignment.getCourseId());
                        notifications.setCourseName(course.getName());
                        notifications.setTitle("Assignment Evaluation");
                        notifications.setMessage("You have been evaluated for the assignment " + assignment.getName() + " and obtained marks " + marks);
                        notifications.setReceiverEmail(studentId);
                        notifications.setReceiverName("Student");
                        notifications.setEmail(studentId);
                        notifications.setType(1);
                        notificationRepo.save(notifications);
                        Notifications notifications1 = new Notifications();
                        notifications1.setCourseId(assignment.getCourseId());
                        notifications1.setCourseName(course.getName());
                        notifications1.setTitle("Assignment Evaluation");
                        notifications1.setMessage("The student " + studentId + " has been evaluated for the assignment " + assignment.getName() + " and obtained marks " + marks);
                        notifications1.setReceiverEmail(course.getFacultyEmail());
                        notifications1.setReceiverName("Faculty");
                        notifications1.setEmail(course.getFacultyEmail());
                        notifications1.setType(1);
                        notificationRepo.save(notifications1);
//                        for (TADetails taEmail : course.getTas()) {
//                            System.out.println("TA Email: " + taEmail.getEmail());
//                            Notifications notifications2 = new Notifications();
//                            notifications2.setCourseId(assignment.getCourseId());
//                            notifications2.setCourseName(course.getName());
//                            notifications2.setTitle("Assignment Evaluation");
//                            notifications2.setMessage("The student " + studentId + " has been evaluated for the assignment " + assignment.getName() + " and obtained marks " + marks);
//                            notifications2.setReceiverEmail(String.valueOf(taEmail));
//                            notifications2.setReceiverName("TA");
//                            notifications2.setEmail(String.valueOf(taEmail));
//                            notifications2.setType(1);
//                            notificationRepo.save(notifications2);
//                        }
                    }
                }
                return new ResponseEntity<>(studentAssignmentSubmission, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(null, null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllCoursesNameByFaculty")
    public ResponseEntity<?> getAllCoursesNameByFaculty(@RequestParam String facultyEmail) {
        try {
            List<Course> courses = repo.findByFacultyEmail(facultyEmail);
            List<String> courseNames = new ArrayList<>();
            for(Course course : courses) {
                courseNames.add(course.getName());
            }
            return new ResponseEntity<>(courseNames, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/raiseToken")
    public ResponseEntity<?> raiseToken(@RequestParam String courseId, @RequestParam String facultyEmail, @RequestParam String studentEmail, @RequestParam String title, @RequestParam String description) {
        try {
            Optional<Course> courseOptional = repo.findById(courseId);
            if(courseOptional.isPresent()) {
                Course course = courseOptional.get();
                Token token = new Token();
                token.setCourseId(courseId);
                token.setFacultyEmail(facultyEmail);
                token.setEmail(studentEmail);
                List<String> taEmails = new ArrayList<>();
                for(int i = 0; i<course.getTas().size(); i++) {
                    taEmails.add(course.getTas().get(i).getEmail());
                    // update the num of token in every TA
                    Optional <TA> ta = taRepo.findById(course.getTas().get(i).getEmail());
                    if(ta.isPresent()) {
                        TA ta1 = ta.get();
                        ta1.setNumberOfTokens(ta1.getNumberOfTokens() + 1);
                        taRepo.save(ta1);
                    }
                }
                token.setTaEmails(taEmails);
                token.setTitle(title);
                token.setDescription(description);
                List<TokenChats> tokenChats = new ArrayList<>();
                TokenChats tokenChats1 = new TokenChats();
                tokenChats1.setSenderEmail(studentEmail);
                List<String> receiverEmails = new ArrayList<>();
                receiverEmails.add(facultyEmail);
                receiverEmails.addAll(taEmails);
                tokenChats1.setReceiverEmails(receiverEmails);
                tokenChats1.setMessage(title);
                tokenChats.add(tokenChats1);
                token.setTokenChats(tokenChats);
                tokenRepo.save(token);
                Notifications notifications = new Notifications();
                notifications.setCourseId(courseId);
                notifications.setCourseName(courseId);
                notifications.setTitle("Token Creation");
                notifications.setMessage("You have raised a token " + title);
                notifications.setReceiverEmail(facultyEmail);
                notifications.setReceiverName("Faculty");
                notifications.setEmail(studentEmail);
                // send notification to al the TAs
                for (String taEmail : taEmails) {
                    Notifications notifications1 = new Notifications();
                    notifications1.setCourseId(courseId);
                    notifications1.setCourseName(courseId);
                    notifications1.setTitle("Token Creation");
                    notifications1.setMessage("A new token " + title + " has been raised by " + studentEmail);
                    notifications1.setReceiverEmail(taEmail);
                    notifications1.setReceiverName("TA");
                    notifications1.setEmail(taEmail);
                    notificationRepo.save(notifications1);
                }
                return new ResponseEntity<>(token, null, HttpStatus.OK);
            }

            return new ResponseEntity<>("Error", null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getTokens")
    public ResponseEntity<?> getTokens(@RequestParam String courseId, @RequestParam String studentEmail) {
        try {
            List<Token> tokens = tokenRepo.findByCourseIdAndStudentEmail(courseId, studentEmail);
            return new ResponseEntity<>(tokens, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllTokensByCourse")
    public ResponseEntity<?> getAllTokensByCourse(@RequestParam String courseId) {
        try {
            List<Token> tokens = tokenRepo.findByCourseId(courseId);
            return new ResponseEntity<>(tokens, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/tokenResolved")
    public ResponseEntity<?> tokenResolved(@RequestParam String id) {
        try {
            Optional<Token> tokenOptional = tokenRepo.findById(id);
            if(tokenOptional.isPresent()) {
                Token token = tokenOptional.get();
                token.setIsResolved(true);
                tokenRepo.save(token);
                // send notification to all the TAs, faculties, and student
                Optional<Course> courseOptional = repo.findById(token.getCourseId());
                if(courseOptional.isPresent()) {
                    Course course = courseOptional.get();
                    Notifications notifications = new Notifications();
                    notifications.setCourseId(token.getCourseId());
                    notifications.setCourseName(course.getName());
                    notifications.setTitle("Token Resolved");
                    notifications.setMessage("The token " + token.getTitle() + " has been resolved");
                    notifications.setReceiverEmail(token.getEmail());
                    notifications.setReceiverName("Student");
                    notifications.setEmail(token.getEmail());
                    notifications.setType(1);
                    notificationRepo.save(notifications);
                    Notifications notifications1 = new Notifications();
                    notifications1.setCourseId(token.getCourseId());
                    notifications1.setCourseName(course.getName());
                    notifications1.setTitle("Token Resolved");
                    notifications1.setMessage("The token " + token.getTitle() + " has been resolved");
                    notifications1.setReceiverEmail(token.getFacultyEmail());
                    notifications1.setReceiverName("Faculty");
                    notifications1.setEmail(token.getFacultyEmail());
                    notifications1.setType(1);
                    notificationRepo.save(notifications1);
                    for (String taEmail : token.getTaEmails()) {
                        Notifications notifications2 = new Notifications();
                        notifications2.setCourseId(token.getCourseId());
                        notifications2.setCourseName(course.getName());
                        notifications2.setTitle("Token Resolved");
                        notifications2.setMessage("The token " + token.getTitle() + " has been resolved");
                        notifications2.setReceiverEmail(taEmail);
                        notifications2.setReceiverName("TA");
                        notifications2.setEmail(taEmail);
                        notifications2.setType(1);
                        notificationRepo.save(notifications2);
                        // set the TA solved the token
                        Optional<TA> ta = taRepo.findById(taEmail);
                        if(ta.isPresent()) {
                            TA ta1 = ta.get();
                            ta1.setNumberOfTokensResolved(ta1.getNumberOfTokensResolved() + 1);
                            taRepo.save(ta1);
                        }
                    }
                }
                return new ResponseEntity<>(token, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getTokenChatsByStudent")
    public ResponseEntity<?> getTokenChatsByStudent(@RequestParam String id) {
        try {
            Optional <Token> tokens= tokenRepo.findById(id);
            if(tokens.isPresent()) {
                System.out.println("Token is present");
                Token token = tokens.get();
                return new ResponseEntity<>(token, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addMessageToToken")
    public ResponseEntity<?> addMessageToToken(@RequestBody TokenChats tokenChat, @RequestParam String id) {
        try {
            Optional<Token> tokenOptional = tokenRepo.findById(id);
            if(tokenOptional.isPresent()) {
                Token token = tokenOptional.get();
                List<TokenChats> tokenChats = token.getTokenChats();
                TokenChats tokenChats1 = new TokenChats();
                tokenChats1.setSenderEmail(tokenChat.getSenderEmail());
                tokenChats1.setMessage(tokenChat.getMessage());
                tokenChats1.setReceiverEmails(tokenChat.getReceiverEmails());
                tokenChats.add(tokenChats1);
                token.setTokenChats(tokenChats);
                tokenRepo.save(token);
                return new ResponseEntity<>(token, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/endTheCourse")
    public ResponseEntity<?> endTheCourse(@RequestParam String courseId) {
        try {
            Optional<Course> courseOptional = repo.findById(courseId);
            if(courseOptional.isPresent()) {
                Course course = courseOptional.get();
                course.setEnded(true);
                repo.save(course);
                return new ResponseEntity<>(course, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/postResultPerStudent")
    public ResponseEntity<?> postResultPerStudent(@RequestBody Result resultPerStudent) {
        try {
            Optional<Course> courseOptional = repo.findById(resultPerStudent.getCourseId());
            if(courseOptional.isPresent()) {
                Course course = courseOptional.get();
                List<Result> resultPerStudents = new ArrayList<>();
                if(course.getResults() != null) {
                    resultPerStudents = course.getResults();
                }
                resultPerStudents.add(resultPerStudent);
                course.setResults(resultPerStudents);
                if(course.getNumOfStudents() == resultPerStudents.size()) {
                    course.setGraded(true);
                }
                repo.save(course);
                Optional<Students> studentsOptional = studentRepo.findById(resultPerStudent.getEmail());
                if(studentsOptional.isPresent()) {
                    Students student = studentsOptional.get();
                    List<Course> courses = new ArrayList<>();
                    if(student.getCourses() != null) {
                        courses = student.getCourses();
                    }
                    for(Course course1 : courses) {
                        if(course1.getId().equals(resultPerStudent.getCourseId())) {
                            course1.setGraded(true);
                        }
                    }
                    student.setCourses(courses);
                    studentRepo.save(student);
                }
                Notifications notifications = new Notifications();
                notifications.setCourseId(resultPerStudent.getCourseId());
                notifications.setCourseName(course.getName());
                notifications.setTitle("Results are declared");
                notifications.setMessage("The results for the course " + course.getName() + " have been declared");
                notifications.setReceiverEmail(resultPerStudent.getEmail());
                notifications.setReceiverName("Student");
                notifications.setEmail(resultPerStudent.getEmail());
                notifications.setType(1);
                notificationRepo.save(notifications);
                // when all the students have been evaluated then send the notification to the faculty
                if(course.getNumOfStudents() == resultPerStudents.size()) {
                    Notifications notifications1 = new Notifications();
                    notifications1.setCourseId(resultPerStudent.getCourseId());
                    notifications1.setCourseName(course.getName());
                    notifications1.setTitle("Results are declared");
                    notifications1.setMessage("The results for the course " + course.getName() + " have been declared");
                    notifications1.setReceiverEmail(course.getFacultyEmail());
                    notifications1.setReceiverName("Faculty");
                    notifications1.setEmail(course.getFacultyEmail());
                    notifications1.setType(1);
                    notificationRepo.save(notifications1);
                }
                return new ResponseEntity<>(resultPerStudent, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getResults")
    public ResponseEntity<?> getResults(@RequestParam String courseId) {
        try {
            Optional<Course> courseOptional = repo.findById(courseId);
            if (courseOptional.isPresent()) {
                Course course = courseOptional.get();
                return new ResponseEntity<>(course.getResults(), null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getResultsByStudent")
    public ResponseEntity<?> getResultsByStudent(@RequestParam String courseId, @RequestParam String studentEmail) {
        try {
            Optional<Course> courseOptional = repo.findById(courseId);
            if (courseOptional.isPresent()) {
                Course course = courseOptional.get();
                List<Result> results = course.getResults();
                for (Result result : results) {
                    if (result.getEmail().equals(studentEmail)) {
                        return new ResponseEntity<>(result, null, HttpStatus.OK);
                    }
                }
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllAssignmentMarksPerStudentByCourse")
    public ResponseEntity<?> getAllAssignmentMarksPerStudentByCourse(@RequestParam String courseId, @RequestParam String studentEmail) {
        try {
            List<StudentAssignmentSubmission> studentAssignmentSubmissions = studentAssignmentSubmissionRepo.findByCourseIdAndStudentId(courseId, studentEmail);
            return new ResponseEntity<>(studentAssignmentSubmissions, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getCoursesBySemester")
    public ResponseEntity<?> getCoursesBySemester(@RequestParam short semester, @RequestParam String instituteName) {
        try {
            System.out.println("Semester: " + semester + " Institute Name: " + instituteName);
            List<Course> courses = repo.findBySemesterAndInstituteName(semester, instituteName);
            System.out.println("Courses: " + courses);
            return new ResponseEntity<>(courses, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/approveTheCourse")
    public ResponseEntity<?> approveTheCourse(@RequestParam String courseId) {
        try {
            Optional<Course> courseOptional = repo.findById(courseId);
            if (courseOptional.isPresent()) {
                Course course = courseOptional.get();
                course.setIsApprovedByAdmin(true);

                Notifications notifications = new Notifications();
                notifications.setCourseId(courseId);
                notifications.setCourseName(course.getName());
                notifications.setTitle("Course Approval");
                notifications.setMessage("The course " + course.getName() + " has been approved by the admin");
                notifications.setReceiverEmail(course.getFacultyEmail());
                notifications.setReceiverName("Faculty");
                notifications.setEmail(course.getFacultyEmail());
                notifications.setType(1);
                notificationRepo.save(notifications);

                repo.save(course);
                return new ResponseEntity<>(course, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateSemester")
    public ResponseEntity<?> updateSemester(@RequestParam String courseId, @RequestParam short semester) {
        try {
            Optional<Course> courseOptional = repo.findById(courseId);
            if (courseOptional.isPresent()) {
                Course course = courseOptional.get();
                course.setSemester(semester);
                Notifications notifications = new Notifications();
                notifications.setCourseId(courseId);
                notifications.setCourseName(course.getName());
                notifications.setTitle("Semester Update");
                notifications.setMessage("The semester for the course " + course.getName() + " has been updated to " + semester + " by the admin");
                notifications.setReceiverEmail(course.getFacultyEmail());
                notifications.setReceiverName("Faculty");
                notifications.setEmail(course.getFacultyEmail());
                notifications.setType(1);
                notificationRepo.save(notifications);
                repo.save(course);
                return new ResponseEntity<>(course, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/setOrUnsetcoreCourse")
    public ResponseEntity<?> setAsCoreCourse(@RequestParam String courseId) {
        try {
            Optional<Course> courseOptional = repo.findById(courseId);
            if(courseOptional.isPresent()) {
                Course course = courseOptional.get();
                course.setIsCoreCourse(!course.getIsCoreCourse());
                // notification to the faculty
                Notifications notifications = new Notifications();
                notifications.setCourseId(courseId);
                notifications.setCourseName(course.getName());
                notifications.setTitle("Core Course Update");
                if(course.getIsCoreCourse())
                    notifications.setMessage("The course " + course.getName() + " has been set as core course by the admin");
                else
                    notifications.setMessage("The course " + course.getName() + " has been set as elective course by the admin");
                notifications.setReceiverEmail(course.getFacultyEmail());
                notifications.setReceiverName("Faculty");
                notifications.setEmail(course.getFacultyEmail());
                notifications.setType(1);
                notificationRepo.save(notifications);
                repo.save(course);
                return new ResponseEntity<>(course, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/endTheSemester")
    public ResponseEntity<?> endTheSemester(@RequestParam short semester, @RequestParam String instituteName) {
        try {
            List<Course> courses = repo.findBySemesterAndInstituteName(semester, instituteName);
            for (Course course : courses) {
                course.setSemester((short)(semester + 8));
                // find faculty and add this course to the semester wise courses
                Optional<Faculties> facultyOptional = facultyRepo.findById(course.getFacultyEmail());
                if(facultyOptional.isPresent()) {
                    Faculties faculty = facultyOptional.get();
                    List<Course> courses1 = new ArrayList<>();
                    if(faculty.getOldCourseList() != null) {
                        courses1 = faculty.getOldCourseList();
                    }
                    courses1.add(course);
                    faculty.setOldCourseList(courses1);
                    List <Course> courses2 = new ArrayList<>();
                    if(faculty.getCurrentCourseList() != null) {
                        courses2 = faculty.getCurrentCourseList();
                    }
                    for(int i = 0; i<courses2.size(); i++) {
                        if(courses2.get(i).getId().equals(course.getId())) {
                            courses2.remove(i);
                            break;
                        }
                    }
                    faculty.setCurrentCourseList(courses2);
                    facultyRepo.save(faculty);
                }
                repo.save(course);
            }
            return new ResponseEntity<>(courses, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/promoteAllStudentToNextSemester")
    public ResponseEntity<?> promoteAllStudentToNextSemester(@RequestParam short semester, @RequestParam String instituteName) {
        try {
            List<Students> studentsOptional = studentRepo.findBYSemesterAndInstituteName(semester, instituteName);
            for(Students student : studentsOptional) {
                student.setSemester((short) (semester + 1));
                List<Course> smeCourses = student.getCourses();
                List<?>[] semesterWiseCourses = new List[8];
                if (student.getSemesterWiseCourses() != null) {
                    semesterWiseCourses = student.getSemesterWiseCourses();
                }
                semesterWiseCourses[semester - 1] = smeCourses;
                student.setSemesterWiseCourses(semesterWiseCourses);
                student.setCourses(new ArrayList<>());
                student.setCourseRegistrationOpen(false);
                student.setTempRegisteredCourses(new ArrayList<>());
                studentRepo.save(student);
            }
            return new ResponseEntity<>("Successful", null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/endAllSemesters")
    public ResponseEntity<?> endALlSemesters(@RequestParam String instituteName) {
        try {
            for(short i = 8; i>=1; i--) {
                promoteAllStudentToNextSemester(i, instituteName);
            }
            // set all default to instituteAdmin
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByInstituteName(instituteName);
            instituteAdmin.setCourseRegistrationEnded(false);
            instituteAdmin.setCourseRegistrationOpen(false);
            instituteAdmin.setStudentWhoTempRegistered(new ArrayList<>());
            int [] semesterWiseRegisterCount = instituteAdmin.getSemesterWiseRegisterCount();
            for(int i = 7; i>=1; i--) {
                semesterWiseRegisterCount[i] = semesterWiseRegisterCount[i-1];
            }
            List<FacultyInfoForAdmin> faculties = instituteAdmin.getFaculties();
            for(FacultyInfoForAdmin faculty : faculties) {
                newSemForFaculty(faculty.getEmail());
            }
            instituteAdminRepo.save(instituteAdmin);
            return new ResponseEntity<>("Successful", null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/newSemForFaculties")
    public ResponseEntity<?> newSemForFaculty(@RequestParam String email) {
        try {
            Faculties faculty = facultyRepo.findByEmail(email);
            List<Course> currentCourses = faculty.getCurrentCourseList();
            List<Course> oldCourses = new ArrayList<>();
            if(faculty.getOldCourseList() != null) {
                oldCourses = faculty.getOldCourseList();
            }
            oldCourses.addAll(currentCourses);
            faculty.setOldCourseList(oldCourses);
            faculty.setCurrentSemesterCourses(0);
            faculty.setCurrentCourseList(new ArrayList<>());
            facultyRepo.save(faculty);
            return new ResponseEntity<> ("Successful", null, HttpStatus.OK);
        } catch(Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/getAllCoursesByInstituteName")
    public ResponseEntity<?> getAllCoursesByInstituteName(@RequestParam String instituteName) {
        try {
            List<Course> courseList = repo.findByInstituteName(instituteName);
            return new ResponseEntity<>(courseList, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}
