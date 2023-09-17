package com.moratorium.services;

import com.moratorium.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private UserService service;

    public UserDetailsServiceImpl(UserService service){
        this.service = service;
    }

    @Transactional
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException{
        User user = service.getByLogin(name);
        if(user==null) throw new UsernameNotFoundException("Login not found");
        Set<GrantedAuthority> roles = new HashSet<>();
        roles.add(new SimpleGrantedAuthority("STUDENT"));
        return new org.springframework.security.core.userdetails.User(user.getLogin(),
                user.getPassword(),
                roles);

    }
}
