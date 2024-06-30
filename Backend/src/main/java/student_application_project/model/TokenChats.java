package student_application_project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TokenChats {
    @Id
    private String id;
    private String tokenID;
    private String senderEmail;
    private List<String> receiverEmails;
    private String message;
    private LocalDate date = LocalDate.now();
    private LocalTime time = LocalTime.now();
}
