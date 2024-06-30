package student_application_project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import student_application_project.model.Course;
import student_application_project.model.Faculties;
import student_application_project.repository.CourseRepo;
import student_application_project.repository.FacultyRepo;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@Controller
@CrossOrigin(origins = "http://localhost:3000")
public class FacultyController {
    @Autowired
    private FacultyRepo facultyRepo;

    @Autowired
    private CourseRepo courseRepo;

    @PostMapping("/addFaculty")
    public ResponseEntity<?> addFaculty(@RequestBody Faculties faculty) {
        try {
//            faculty.setPassword((faculty.getPassword()));
            facultyRepo.save(faculty);
            return new ResponseEntity<Faculties>(faculty, null, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Data not added!", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("getAllFaculty")
    public ResponseEntity<?> getAllFaculties() {
        try {
            return new ResponseEntity<>(facultyRepo.findAll(), null, HttpStatus.OK);
        } catch ( Exception e ) {
            return new ResponseEntity<>("Error Occurred!", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @GetMapping("getFaculty")
//    public ResponseEntity<?> getFacultyById(@RequestBody Faculties faculty) {
//        try {
//            return new ResponseEntity<>(facultyRepo.findById(faculty.getId()), null, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(e, null, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    @PostMapping("/addCourseToFaculty")
    public ResponseEntity<?> addCourseToFaculty(@RequestBody Course course, @RequestParam String Id) {
        try {
            Optional<Faculties> faculties = facultyRepo.findById(Id);
            if(faculties.isPresent()) {
                Faculties faculty = faculties.get();
                List<Course> courses = new ArrayList<>();
                if(faculty.getCurrentCourseList() == null) {
                    courses.add(course);
                    faculty.setCurrentCourseList(courses);
                } else {
                    courses = faculty.getCurrentCourseList();
                    courses.add(course);
                    faculty.setCurrentCourseList(courses);
                }
                facultyRepo.save(faculty);
                return new ResponseEntity<>(faculty, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not present!", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e, null, HttpStatus.OK);
        }
    }

    @GetMapping("/getFaculty")
    public ResponseEntity<?> getFaculty(@RequestParam String Id) {
        try {
            Optional<Faculties> faculties = facultyRepo.findById(Id);
            if(faculties.isPresent()) {
                Faculties faculty = faculties.get();
                return new ResponseEntity<>(faculty, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not found", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/editFacultyCourse")
    public ResponseEntity<?> editFacultyCourse(@RequestBody Course course, @RequestParam String facultyId) {
        try {
            Optional<Faculties> faculties = facultyRepo.findById(facultyId);
            if(faculties.isPresent()) {
                Faculties faculty = faculties.get();
                List <Course> currentCourses = faculty.getCurrentCourseList();
                for(int i = 0; i<currentCourses.size(); i++) {
                    if(Objects.equals(course.getId(), currentCourses.get(i).getId())) {
                        currentCourses.remove(i);
                        break;
                    }
                }
                currentCourses.add(course);
                faculty.setCurrentCourseList(currentCourses);
                facultyRepo.save(faculty);
                return new ResponseEntity<>(faculty, null, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Data not updated!", null, HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
