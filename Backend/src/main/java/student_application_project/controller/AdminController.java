package student_application_project.controller;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import student_application_project.model.*;
import student_application_project.repository.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    @Autowired
    private InstituteAdminRepo instituteAdminRepo;

    @Autowired
    private SuperAdminRepo superAdminRepo;

    @Autowired
    private TArepo tArepo;

    @Autowired
    private FacultyRepo facultyRepo;

    @Autowired
    private NotificationRepo notificationRepo;

    @Autowired
    private StudentDetailsRepo studentDetailsRepo;

    @Autowired
    private StudentApplicationProjectRepo studentApplicationProjectRepo;

    @Autowired
    private CourseRepo courseRepo;

    @PostMapping("/addFacultyByAdmin")
    public ResponseEntity<?> addFacultyByAdmin(@RequestBody Faculties faculties, @RequestParam String email) {
        try {
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(email);
            instituteAdmin.setNumberOfFaculties(instituteAdmin.getNumberOfFaculties() + 1);
            faculties.setPassword("password");
            faculties.setInstituteName(instituteAdmin.getInstituteName());
            facultyRepo.save(faculties);
            FacultyInfoForAdmin facultyInfoForAdmin = new FacultyInfoForAdmin();
            facultyInfoForAdmin.setEmail(faculties.getEmail());
            facultyInfoForAdmin.setName(faculties.getName());
            instituteAdmin.getFaculties().add(facultyInfoForAdmin);
            instituteAdminRepo.save(instituteAdmin);
            Notifications notifications = new Notifications();
            notifications.setEmail(faculties.getEmail());
            notifications.setTitle("Faculty added by your institute admin");
            notifications.setType(1);
            notifications.setMessage("You are added as a faculty by " + email);
            notificationRepo.save(notifications);
            Notifications notifications1 = new Notifications();
            notifications1.setEmail(email);
            notifications1.setTitle("Faculty added");
            notifications1.setType(1);
            notifications1.setMessage("Faculty added successfully " + faculties.getEmail());
            notificationRepo.save(notifications1);
            SuperAdmin superAdmin = superAdminRepo.findByEmail("super_admin@gmail.com");
            superAdmin.setNumberOfFaculties(superAdmin.getNumberOfFaculties() + 1);
            superAdminRepo.save(superAdmin);
            Notifications notifications2 = new Notifications();
            notifications2.setEmail("super_admin@gmail.com");
            notifications2.setTitle("Faculty added");
            notifications2.setType(1);
            notifications2.setMessage("Faculty" + faculties.getEmail() + " added successfully by " + email);
            notificationRepo.save(notifications2);
            return new ResponseEntity<>("Successful", null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addInstituteAdmin")
    public ResponseEntity<?> addInstituteAdmin(@RequestBody InstituteAdmin instituteAdmin) {
        try {
            instituteAdminRepo.save(instituteAdmin);
            return new ResponseEntity<>(instituteAdmin, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addSuperAdmin")
    public ResponseEntity<?> addSuperAdmin(@RequestBody SuperAdmin admin) {
        try {
            superAdminRepo.save(admin);
            return new ResponseEntity<>(admin, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/loginInstituteAdmin")
    public ResponseEntity<?> loginInstituteAdmin(@RequestBody InstituteAdmin admin) {
        try {
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(admin.getEmail());
            if (instituteAdmin.getPassword().equals(admin.getPassword())) {
                return new ResponseEntity<>("Pass", null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Fail", null, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/loginSuperAdmin")
    public ResponseEntity<?> loginSuperAdmin(@RequestBody SuperAdmin instituteAdmin) {
        try {
            SuperAdmin superAdmin = superAdminRepo.findByEmail(instituteAdmin.getEmail());
            if (superAdmin.getPassword().equals(instituteAdmin.getPassword())) {
                return new ResponseEntity<>("Pass", null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Fail", null, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getFacultiesNameForInstituteAdmin")
    public ResponseEntity<?> getFacultiesNameForInstituteAdmin(@RequestParam String email) {
        try {
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(email);
            List<FacultyInfoForAdmin> faculties = instituteAdmin.getFaculties();
            List<String> facultyNames = new ArrayList<>();
            for (FacultyInfoForAdmin faculty : faculties) {
                facultyNames.add(faculty.getEmail());
            }
            return new ResponseEntity<>(facultyNames, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getInstituteAdmin")
    public ResponseEntity<?> getInstituteAdmin(@RequestParam String email) {
        try {
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(email);
            return new ResponseEntity<>(instituteAdmin, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getSuperAdmin")
    public ResponseEntity<?> getSuperAdmin(@RequestParam String email) {
        try {
            SuperAdmin superAdmin = superAdminRepo.findByEmail(email);
            return new ResponseEntity<>(superAdmin, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addTAByAdmin")
    public ResponseEntity<?> addTAByAdmin(@RequestBody TA tas, @RequestParam String email) {
        try {
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(email);
            instituteAdmin.setNumberOfTAs(instituteAdmin.getNumberOfTAs() + 1);
            tas.setPassword("password");
            tas.setInstituteName(instituteAdmin.getInstituteName());
            tArepo.save(tas);
            TAInformationForAdmin taInformationForAdmin = new TAInformationForAdmin();
            taInformationForAdmin.setEmail(tas.getEmail());
            taInformationForAdmin.setName(tas.getName());
            instituteAdmin.getTas().add(taInformationForAdmin);
            instituteAdminRepo.save(instituteAdmin);
            Notifications notifications = new Notifications();
            notifications.setEmail(tas.getEmail());
            notifications.setTitle("TA added by your institute admin");
            notifications.setType(1);
            notifications.setMessage("You are added as a TA by " + email);
            notificationRepo.save(notifications);
            Notifications notifications1 = new Notifications();
            notifications1.setEmail(email);
            notifications1.setTitle("TA added");
            notifications1.setType(1);
            notifications1.setMessage("TA added successfully " + tas.getEmail());
            notificationRepo.save(notifications1);
            Notifications notifications2 = new Notifications();
            notifications2.setEmail("super_admin@gmail.com");
            notifications2.setTitle("TA added");
            notifications2.setType(1);
            notifications2.setMessage("TA" + tas.getEmail() + " added successfully by " + email);
            notificationRepo.save(notifications2);
            SuperAdmin superAdmin = superAdminRepo.findByEmail("super_admin@gmail.com");
            superAdmin.setNumberOfTAs(superAdmin.getNumberOfTAs() + 1);
            superAdminRepo.save(superAdmin);
            return new ResponseEntity<>("Successful", null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllTAsEmails")
    public ResponseEntity<?> getAllTAsEmails() {
        try {
            List<TA> tas = tArepo.findAll();
            List<String> taEmails = new ArrayList<>();
            for (TA ta : tas) {
                taEmails.add(ta.getEmail());
            }
            return new ResponseEntity<>(taEmails, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllFacultiesEmails")
    public ResponseEntity<?> getAllFacultiesEmails() {
        try {
            List<Faculties> faculties = facultyRepo.findAll();
            List<String> facultyEmails = new ArrayList<>();
            for (Faculties faculty : faculties) {
                facultyEmails.add(faculty.getEmail());
            }
            return new ResponseEntity<>(facultyEmails, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllInstituteAdminsEmails")
    public ResponseEntity<?> getAllInstituteAdminsEmails() {
        try {
            List<InstituteAdmin> instituteAdmins = instituteAdminRepo.findAll();
            List<String> instituteAdminEmails = new ArrayList<>();
            for (InstituteAdmin instituteAdmin : instituteAdmins) {
                instituteAdminEmails.add(instituteAdmin.getEmail());
            }
            return new ResponseEntity<>(instituteAdminEmails, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllInstituteAdminsInstituteNames")
    public ResponseEntity<?> getAllInstituteAdminsInstituteNames() {
        try {
            List<InstituteAdmin> instituteAdmins = instituteAdminRepo.findAll();
            List<String> instituteAdminInstituteNames = new ArrayList<>();
            for (InstituteAdmin instituteAdmin : instituteAdmins) {
                instituteAdminInstituteNames.add(instituteAdmin.getInstituteName());
            }
            return new ResponseEntity<>(instituteAdminInstituteNames, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addInstituteAdminBySuperAdmin")
    public ResponseEntity<?> addInstituteAdminBySuperAdmin(@RequestBody InstituteAdmin instituteAdmin) {
        try {
            instituteAdminRepo.save(instituteAdmin);
            Notifications notifications = new Notifications();
            notifications.setEmail(instituteAdmin.getEmail());
            notifications.setTitle("Institute Admin added by super admin");
            notifications.setType(1);
            notifications.setMessage("You are added as an institute admin by super admin");
            notificationRepo.save(notifications);
            SuperAdmin superAdmin = superAdminRepo.findByEmail("super_admin@gmail.com");
            superAdmin.setNumberOfInstituteAdmins(superAdmin.getNumberOfInstituteAdmins() + 1);
            superAdminRepo.save(superAdmin);
            Notifications notifications1 = new Notifications();
            notifications1.setEmail("super_admin@gmail.com");
            notifications1.setTitle("Institute Admin added");
            notifications1.setType(1);
            notifications1.setMessage("Institute Admin added successfully " + instituteAdmin.getEmail());
            notificationRepo.save(notifications1);
            return new ResponseEntity<>("Successful", null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllInstituteAdmins")
    public ResponseEntity<?> getAllInstituteAdmins() {
        try {
            List<InstituteAdmin> instituteAdmins = instituteAdminRepo.findAll();
            return new ResponseEntity<>(instituteAdmins, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllFacultyByInstituteAdmin")
    public ResponseEntity<?> getAllFacultyByInstituteAdmin(@RequestParam String email) {
        try {
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(email);
            List<FacultyInfoForAdmin> faculties = instituteAdmin.getFaculties();
            return new ResponseEntity<>(faculties, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllTAByInstituteAdmin")
    public ResponseEntity<?> getAllTAByInstituteAdmin(@RequestParam String email) {
        try {
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(email);
            List<TAInformationForAdmin> tas = instituteAdmin.getTas();
            return new ResponseEntity<>(tas, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getStudentsByInstitute")
    public ResponseEntity<?> getStudentsByInstitute(@RequestParam String email) {
        try {
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(email);
            List<StudentDetails> students = instituteAdmin.getStudents();
            return new ResponseEntity<>(students, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addStudentByInstituteAdmin")
    public ResponseEntity<?> addStudentByInstituteAdmin(@RequestBody Students student) {
        try {
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(student.getInstituteAdminEmail());
            instituteAdmin.setNumberOfStudents(instituteAdmin.getNumberOfStudents() + 1);
            int [] semesterWiseStudentCount = instituteAdmin.getSemesterWiseStudentCount();
            semesterWiseStudentCount[student.getSemester() - 1] = semesterWiseStudentCount[student.getSemester() - 1] + 1;
            instituteAdmin.setSemesterWiseRegisterCount(semesterWiseStudentCount);
            StudentDetails studentDetails = new StudentDetails();
            studentDetails.setFirstName(student.getFirstName());
            studentDetails.setLastName(student.getLastName());
            studentDetails.setEmail(student.getEmail());
            studentDetails.setDateOfBirth(student.getDateOfBirth());
            studentDetails.setGander(student.getGander());
            studentDetails.setInstituteName(instituteAdmin.getInstituteName());
            studentDetails.setStudentSemester(String.valueOf(student.getSemester()));
            studentDetails.setMobileNumber(student.getMobileNumber());
            studentDetailsRepo.save(studentDetails);
            studentApplicationProjectRepo.save(student);
            instituteAdmin.getStudents().add(studentDetails);
            instituteAdminRepo.save(instituteAdmin);
            Notifications notifications = new Notifications();
            notifications.setEmail(studentDetails.getEmail());
            notifications.setTitle("Student added by your institute admin");
            notifications.setType(1);
            notifications.setMessage("You are added as a student by " + student.getInstituteAdminEmail());
            notificationRepo.save(notifications);
            Notifications notifications1 = new Notifications();
            notifications1.setEmail(student.getInstituteAdminEmail());
            notifications1.setTitle("Student added");
            notifications1.setType(1);
            notifications1.setMessage("Student added successfully " + studentDetails.getEmail());
            notificationRepo.save(notifications1);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return null;
    }

    @PostMapping("/registerCoursesForStudent")
    public ResponseEntity<?> registerCoursesForStudent(@RequestBody Students student) {
        try {
            Students students = studentApplicationProjectRepo.findByEmail(student.getEmail());
            students.setTempRegisteredCourses(student.getTempRegisteredCourses());
            String instituteName = students.getInstituteName();
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByInstituteName(instituteName);
            // add studentCustom to instituteAdmin if it not exists
            StudentCustom studentCustom = new StudentCustom();
            studentCustom.setId(student.getEmail());
            studentCustom.setName(student.getFirstName() + " " + student.getLastName());
            List<StudentCustom> studentCustomList = instituteAdmin.getStudentWhoTempRegistered();
            if(studentCustomList == null) {
                studentCustomList = new ArrayList<>();
            }
            boolean isStudentAlreadyRegistered = false;
            for(StudentCustom studentCustom1 : studentCustomList) {
                if(studentCustom1.getId().equals(studentCustom.getId())) {
                    isStudentAlreadyRegistered = true;
                    instituteAdmin.getStudentWhoTempRegistered().remove(studentCustom1);
                }
            }
            if(!isStudentAlreadyRegistered) {
                int [] semesterWiseRegisterCount = instituteAdmin.getSemesterWiseRegisterCount();
                semesterWiseRegisterCount[student.getSemester() - 1] = semesterWiseRegisterCount[student.getSemester() - 1] + 1;
                instituteAdmin.setSemesterWiseRegisterCount(semesterWiseRegisterCount);
            }
            studentApplicationProjectRepo.save(students);
            return new ResponseEntity<>("Successful", null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/registerAllStudentToTheirTempCourses")
    public ResponseEntity<?> registerAllStudentToTheirTempCourses(@RequestParam String email) {
        try {
            System.out.println(email);
            System.out.println("1");
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(email);
            instituteAdmin.setCourseRegistrationEnded(true);
            instituteAdminRepo.save(instituteAdmin);
            List<Students> studentsOp = studentApplicationProjectRepo.findByInstituteName(instituteAdmin.getInstituteName());
            for (Students student : studentsOp) {
                Students students1 = student;
                System.out.println("2");
                StudentCustom studentCustom = new StudentCustom();
                studentCustom.setId(students1.getEmail());
                studentCustom.setName(students1.getFirstName() + " " + students1.getLastName());
                List<String> coursesId = students1.getTempRegisteredCourses();
                System.out.println("3");
                for (String courseId : coursesId) {
                    System.out.println("4");
                    Optional<Course> courseOptional = courseRepo.findById(courseId);
                    System.out.println("5");
                    if (courseOptional.isPresent()) {
                        System.out.println("6");
                        Course course = courseOptional.get();
                        List<StudentCustom> studentCustomList = new ArrayList<>();
                        if(course.getStudents() != null) {
                            studentCustomList = course.getStudents();
                        }
                        System.out.println("7");
                        studentCustomList.add(studentCustom);
                        System.out.println("71");
                        course.setStudents(studentCustomList);
                        System.out.println("72");
                        course.setNumOfStudents(course.getNumOfStudents() + 1);
                        System.out.println("73");
                        courseRepo.save(course);
                        System.out.println("74");
                        List <Course> courses = new ArrayList<>();
                        if(students1.getCourses() != null) {
                            courses = students1.getCourses();
                        }
                        courses.add(course);
                        students1.setCourses(courses);
                        System.out.println("75");
                    }
                }
                System.out.println("8");
                students1.setTempRegisteredCourses(new ArrayList<>());
                studentApplicationProjectRepo.save(students1);
                System.out.println("9");
            }
            System.out.println("10");
            return new ResponseEntity<>("Successful", null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/openCloseRegistrationForAllStudents")
    public ResponseEntity<?> openCloseRegistrationForAllStudents(@RequestParam String email, @RequestParam boolean isOpen) {
        try {
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(email);
            List<Students> students = studentApplicationProjectRepo.findByInstituteName(instituteAdmin.getInstituteName());
            for (Students student : students) {
                student.setCourseRegistrationOpen(isOpen);
                studentApplicationProjectRepo.save(student);
            }
            instituteAdmin.setCourseRegistrationOpen(isOpen);
            instituteAdminRepo.save(instituteAdmin);
            return new ResponseEntity<>("Successful", null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteStudent")
    public ResponseEntity<?> deleteStudent(@RequestParam String email, @RequestParam String instituteAdminEmail) {
        try {
            // delete manually
            Students student = studentApplicationProjectRepo.findByEmail(email);
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(instituteAdminEmail);
            instituteAdmin.setNumberOfStudents(instituteAdmin.getNumberOfStudents() - 1);
            List <StudentDetails> studentDetails = instituteAdmin.getStudents();
            System.out.println("0");
            for(StudentDetails studentDetails1 : studentDetails) {
                if(studentDetails1.getEmail().equals(email)) {
                    instituteAdmin.getStudents().remove(studentDetails1);
                    break;
                }
            }
            instituteAdmin.setStudents(studentDetails);
            instituteAdminRepo.save(instituteAdmin);
            System.out.println("1");
//            InstituteAdmin instituteAdmin = instituteAdminRepo.findByInstituteName(student.getInstituteName());
//            instituteAdmin.setNumberOfStudents(instituteAdmin.getNumberOfStudents() - 1);
//            System.out.println("2");
//            instituteAdminRepo.save(instituteAdmin);
            System.out.println("3");
            studentApplicationProjectRepo.deleteById(email);
            System.out.println("4");
            return new ResponseEntity<>("Successful", null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteFaculty")
    public ResponseEntity<?> deleteFaculty(@RequestParam String email, @RequestParam String instituteAdminEmail) {
        try {
            facultyRepo.deleteById(email);
            InstituteAdmin instituteAdmin = instituteAdminRepo.findByEmail(instituteAdminEmail);
            instituteAdmin.setNumberOfFaculties(instituteAdmin.getNumberOfFaculties() - 1);
            List <FacultyInfoForAdmin> facultyInfoForAdmins = instituteAdmin.getFaculties();
            for(FacultyInfoForAdmin facultyInfoForAdmin : facultyInfoForAdmins) {
                if(facultyInfoForAdmin.getEmail().equals(email)) {
                    instituteAdmin.getFaculties().remove(facultyInfoForAdmin);
                    break;
                }
            }
            instituteAdmin.setFaculties(facultyInfoForAdmins);
            instituteAdminRepo.save(instituteAdmin);
            return new ResponseEntity<>("Successful", null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllFacultiesByInstituteName")
    public ResponseEntity<?> getAllFacultiesByInstituteName(@RequestParam String instituteName) {
        try {
            List<Faculties> faculties = facultyRepo.findByInstituteName(instituteName);
            return new ResponseEntity<>(faculties, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAllRegisteredCoursesForStudent")
    public ResponseEntity<?> getAllRegisteredCoursesForStudent (@RequestParam String email, @RequestParam short semester) {
        try {
            Students student = studentApplicationProjectRepo.findByEmail(email);
            List<Course> courses = new ArrayList<>();
            List<?>[] semWiseCourses =  student.getSemesterWiseCourses();
            for(int i = 0; i<semester; i++) {
                List <?> courseList = semWiseCourses[i];
                courses.addAll((Collection<? extends Course>) courseList);
            }
            List<Course> courseIds =  new ArrayList<>();
            for(Course course : courses) {
                Course tempCourse = new Course();
                tempCourse.setName(course.getName());
                tempCourse.setId(course.getId());
                courseIds.add(tempCourse);
            }
            return new ResponseEntity<>(courseIds, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/changeMaxNumberOfStudentInCourse")
    public ResponseEntity<?> changeMaxNumberOfStudentInCourse(@RequestParam String id, @RequestParam int number) {
        try {
            Optional<Course> courseOptional = courseRepo.findById(id);
            if(courseOptional.isPresent()) {
                Course course = courseOptional.get();
                course.setMaxStudentNum(number);
                courseRepo.save(course);
                return new ResponseEntity<>("Successful", null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Fail", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
