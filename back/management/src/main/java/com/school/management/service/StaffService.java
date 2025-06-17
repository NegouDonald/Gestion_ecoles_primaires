package com.school.management.service;

import com.school.management.entity.Notification;
import com.school.management.entity.Staff;
import com.school.management.entity.User;
import com.school.management.entity.enums.UserRole;
import com.school.management.repository.NotificationRepository;
import com.school.management.repository.StaffRepository;
import com.school.management.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public Staff createStaff(Staff staff) {
        if (staff.getFirstName() == null || staff.getLastName() == null || staff.getEmail() == null) {
            throw new IllegalArgumentException("Les champs firstName, lastName et email sont obligatoires.");
        }

        if (staff.getUser() != null) {
            User user = staff.getUser();
            if (user.getUsername() == null || user.getPassword() == null) {
                throw new IllegalArgumentException("Le nom d'utilisateur et le mot de passe sont obligatoires pour créer un compte utilisateur.");
            }
            user.setFirstName(staff.getFirstName());
            user.setLastName(staff.getLastName());
            user.setEmail(staff.getEmail());
            if (user.getRole() == null) {
                user.setRole(staff.getRole());
            }
            user = userRepository.save(user);
            staff.setUser(user);

            Notification notification = new Notification();
            notification.setMessage("Veuillez modifier vos informations de compte (mot de passe, etc.) pour sécuriser votre accès.");
            notification.setRead(false);
            notification.setUser(user);
            notificationRepository.save(notification);
        }

        return staffRepository.save(staff);
    }

    @Transactional(readOnly = true)
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Personnel non trouvé avec l'ID: " + id));
    }

    @Transactional(readOnly = true)
    public Staff getStaffByEmail(String email) {
        return staffRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Personnel non trouvé avec l'email: " + email));
    }

    @Transactional(readOnly = true)
    public List<Staff> getStaffByDepartment(String department) {
        return staffRepository.findByDepartment(department);
    }

    @Transactional(readOnly = true)
    public List<Staff> getStaffByPosition(String position) {
        return staffRepository.findByPosition(position);
    }

    @Transactional(readOnly = true)
    public List<Staff> getStaffByRole(UserRole role) {
        return staffRepository.findByRole(role);
    }

    @Transactional(readOnly = true)
    public Page<Staff> getStaffBySearch(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return staffRepository.findAll(pageable);
        }
        return staffRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(search, search, pageable);
    }

    @Transactional
    public Staff updateStaff(Long id, Staff updatedStaff) {
        Staff existingStaff = getStaffById(id);

        // Mise à jour conditionnelle des champs de Staff
        if (updatedStaff.getFirstName() != null && !updatedStaff.getFirstName().isBlank()) {
            existingStaff.setFirstName(updatedStaff.getFirstName());
        }

        if (updatedStaff.getLastName() != null && !updatedStaff.getLastName().isBlank()) {
            existingStaff.setLastName(updatedStaff.getLastName());
        }

        if (updatedStaff.getEmail() != null && !updatedStaff.getEmail().isBlank()) {
            existingStaff.setEmail(updatedStaff.getEmail());
        }

        if (updatedStaff.getPhone() != null) {
            existingStaff.setPhone(updatedStaff.getPhone());
        }

        if (updatedStaff.getAddress() != null) {
            existingStaff.setAddress(updatedStaff.getAddress());
        }

        if (updatedStaff.getGender() != null) {
            existingStaff.setGender(updatedStaff.getGender());
        }

        if (updatedStaff.getRole() != null) {
            existingStaff.setRole(updatedStaff.getRole());
        }

        if (updatedStaff.getBirthDate() != null) {
            existingStaff.setBirthDate(updatedStaff.getBirthDate());
        }

        if (updatedStaff.getHireDate() != null) {
            existingStaff.setHireDate(updatedStaff.getHireDate());
        }

        if (updatedStaff.getPosition() != null) {
            existingStaff.setPosition(updatedStaff.getPosition());
        }

        if (updatedStaff.getDepartment() != null) {
            existingStaff.setDepartment(updatedStaff.getDepartment());
        }

        if (updatedStaff.getSalary() != null) {
            existingStaff.setSalary(updatedStaff.getSalary());
        }

        // ======= Gestion du User associé =======
        User incomingUser = updatedStaff.getUser();

        if (incomingUser != null) {
            // Vérification minimale pour créer un User
            if (incomingUser.getUsername() == null || incomingUser.getUsername().isBlank()) {
                throw new IllegalArgumentException("Le nom d'utilisateur est obligatoire pour créer ou mettre à jour un compte utilisateur.");
            }

            if (existingStaff.getUser() == null) {
                // Création d’un nouveau User
                if (incomingUser.getPassword() == null || incomingUser.getPassword().isBlank()) {
                    throw new IllegalArgumentException("Le mot de passe est obligatoire pour créer un utilisateur.");
                }

                incomingUser.setFirstName(existingStaff.getFirstName());
                incomingUser.setLastName(existingStaff.getLastName());
                incomingUser.setEmail(existingStaff.getEmail());
                incomingUser.setRole(existingStaff.getRole());
                incomingUser.setPhone(existingStaff.getPhone());

                User savedUser = userRepository.save(incomingUser);
                existingStaff.setUser(savedUser);

                // Notification de création de compte
                Notification notification = new Notification();
                notification.setMessage("Un compte utilisateur a été créé pour vous. Veuillez modifier vos informations de compte.");
                notification.setRead(false);
                notification.setUser(savedUser);
                notificationRepository.save(notification);

            } else {
                // Mise à jour d’un User existant
                User existingUser = existingStaff.getUser();

                if (incomingUser.getUsername() != null && !incomingUser.getUsername().isBlank()) {
                    existingUser.setUsername(incomingUser.getUsername());
                }

                if (incomingUser.getPassword() != null && !incomingUser.getPassword().isBlank()) {
                    existingUser.setPassword(incomingUser.getPassword());
                }

                existingUser.setFirstName(existingStaff.getFirstName());
                existingUser.setLastName(existingStaff.getLastName());
                existingUser.setEmail(existingStaff.getEmail());

                if (incomingUser.getPhone() != null) {
                    existingUser.setPhone(incomingUser.getPhone());
                }

                if (incomingUser.getRole() != null) {
                    existingUser.setRole(incomingUser.getRole());
                }

                userRepository.save(existingUser);
            }
        }

        return staffRepository.save(existingStaff);
    }



    @Transactional
    public void deleteStaff(Long id) {
        Staff staff = getStaffById(id);
        staffRepository.delete(staff);
    }
}