package com.moratorium.services;

import com.moratorium.model.User;
import com.moratorium.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getByLogin(String name) {
        if (userRepository.existsById(name)) {
            return userRepository.getReferenceById(name);
        } else return null;
    }

    public List<User> getAll() {
        return this.userRepository.findAll();
    }

//    public boolean addUser(UserEntity user) {
//        if (userRepository.existsById(user.getLogin())) {
//            return false;
//        }
//
//        userRepository.saveAndFlush(user);
//        return true;
//    }
}