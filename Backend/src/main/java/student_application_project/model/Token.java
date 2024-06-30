package student_application_project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Token {
    @Id
    private String id;
    private String email;
    private String title;
    private String description;
    private String courseId;
    private String facultyEmail;
    private List<String> taEmails;
    private Boolean isResolved = false;
    private LocalDateTime createdDateTime = LocalDateTime.now();
    private List<TokenChats> tokenChats = new ArrayList<>();
}
