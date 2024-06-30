package student_application_project.controller;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import student_application_project.EmailSenderService;
import student_application_project.model.Course;
import student_application_project.model.Students;
import student_application_project.repository.StudentApplicationProjectRepo;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class StudentApplicationProjectController {

    @Autowired
    private StudentApplicationProjectRepo repo;

    private String OTP = "";

    @Autowired
    private EmailSenderService senderService;

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        List<Students> students = repo.findAll();
        if (students.size() == 0) {
            return new ResponseEntity<>("No Students available", null, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<List<Students>>(students, null, HttpStatus.OK);
        }
    }

    @PostMapping("/addStudent")
    public ResponseEntity<?> addStudent(@RequestBody Students student) {
        try {
            repo.save(student);
            return new ResponseEntity<Students>(student, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/student/{id}")
    public ResponseEntity<?> getSingleStudent(@PathVariable("id") String id) {
        try {
            Optional<Students> studentOptional = repo.findById(id);
            if (studentOptional.isPresent()) {
                return new ResponseEntity<>(studentOptional.get(), null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No Student found with id: " + id, null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/student/{id}")
    public ResponseEntity<?> updateById(@PathVariable("id") String id, @RequestBody Students student) {
        try {
            Optional<Students> studentOptional = repo.findById(id);
            if (studentOptional.isPresent()) {
                Students studentData = studentOptional.get();
                studentData.setFirstName(student.getFirstName());
                studentData.setLastName(student.getLastName());
                studentData.setEmail(student.getEmail());
                studentData.setLoggedIn(student.isLoggedIn());
                repo.save(studentData);
                return new ResponseEntity<>(studentData, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No Student found with id: " + id, null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> studentLogin(@RequestBody Students students) {

        try {
            boolean isStudentExist = repo.existsById(students.getEmail());
            if(isStudentExist) {
                Students students1 = repo.findByEmail(students.getEmail());
                if(Objects.equals(students1.getPassword(), students.getPassword())) {
                    students.setLoggedIn(true);
                    return new ResponseEntity<Students>(students, null, HttpStatus.OK);
                }
                students.setLoggedIn(false);
                return new ResponseEntity<>(students, null, HttpStatus.OK);
            } else {
                students.setLoggedIn(false);
                return new ResponseEntity<>(students, null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("0" + e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/student/{id}")
    public ResponseEntity<?> deleteById(@PathVariable("id") String id) {
        try {
            Optional<Students> studentOptional = repo.findById(id);
            if (studentOptional.isPresent()) {
                repo.deleteById(id);
                return new ResponseEntity<>("Student with id: " + id + " deleted successfully", null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No Student found with id: " + id, null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/namebyemail/{email}")
    public ResponseEntity<?> getNameByEmail(@PathVariable("email") String email) {
        try {
            Students student = repo.findByEmail(email);
            if (student != null) {
                return new ResponseEntity<>(student.getFirstName(), null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No Student found with email: " + email, null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/statebyemail/{email}")
    public ResponseEntity<?> getStateByEmail(@PathVariable("email") String email) {
        try {
            Students student = repo.findByEmail(email);
            if (student != null) {
                return new ResponseEntity<>(student.isLoggedIn(), null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No Student found with email: " + email, null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/verify/{email}")
    public ResponseEntity<?> verifyEmail(@PathVariable("email") String email) {
        OTP = senderService.generateOTP();
        try {
            senderService.sendEmail(email, "Login to Student Application Project", "Verification OTP is: " + OTP);
            return new ResponseEntity<>("OTP is: " + OTP, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getOTP")
    public ResponseEntity<?> getOTP() {
        return new ResponseEntity<>("OTP is: " + OTP, null, HttpStatus.OK);
    }

    @GetMapping("/verifyOTP/{otp}")
    public ResponseEntity<?> verifyOTP(@PathVariable("otp") String otp) {
        if (OTP.equals(otp)) {
            return new ResponseEntity<>("OTP verified successfully", null, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("OTP verification failed", null, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/studentbyemail/{email}")
    public ResponseEntity<?> getStudentByEmail(@PathVariable("email") String email) {
        try {
            Students student = repo.findByEmail(email);
            if (student != null) {
                return new ResponseEntity<>(student, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No Student found with email: " + email, null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/registerCourses/{email}")
    public ResponseEntity<?> registerCourses(@PathVariable("email") String email, @RequestBody List<Course> courses) {
        try {
            Students student = repo.findByEmail(email);
            if (student != null) {
//                student.setRegisteredCourses(courses);
                repo.save(student);
                return new ResponseEntity<>(student, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("No Student found with email: " + email, null, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @GetMapping("/getCourses/{email}")
//    public ResponseEntity<?> getCourses(@PathVariable("email") String email) {
//        try {
//            Students student = repo.findByEmail(email);
//            if (student != null) {
//                return new ResponseEntity<>(student.getRegisteredCourses(), null, HttpStatus.OK);
//            } else {
//                return new ResponseEntity<>("No Student found with email: " + email, null, HttpStatus.NOT_FOUND);
//            }
//        } catch (Exception e) {
//            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @GetMapping("/getStudentByEmailId")
    public ResponseEntity<?> geStudentBYEmailId(@RequestParam String Email) {
        try {
            Students student = repo.findByEmail(Email);
            return new ResponseEntity<>(student, null, HttpStatus.OK);
        } catch(Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateStudentByEmail")
    public ResponseEntity<?> updateStudentByEmail(@RequestBody Students student) {
        try {
            Students studentOp = repo.findByEmail(student.getEmail());
            studentOp.setFirstName(student.getFirstName());
            studentOp.setLastName(student.getLastName());
            studentOp.setGander(student.getGander());
            studentOp.setProgram(student.getProgram());
            studentOp.setInstituteName(student.getInstituteName());
            studentOp.setDateOfBirth(student.getDateOfBirth());
            studentOp.setMobileNumber(student.getMobileNumber());
            repo.save(studentOp);
            return new ResponseEntity<>(studentOp, null, HttpStatus.OK);
        } catch ( Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}