package com.aim.questionnaire.service;

import com.aim.questionnaire.dao.UserEntityMapper;
import com.aim.questionnaire.dao.entity.UserEntity;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @author: Ingsuifon
 **/
@Service
public class UserService {
    @Autowired
    private UserEntityMapper userEntityMapper;

    public UserEntity selectAllByName(String username) {
        return userEntityMapper.selectAllByName(username);
    }

    public void addUserInfo(UserEntity userEntity) {
        userEntityMapper.addUserInfo(userEntity);
    }

    public List<Map<String, Object>> queryUserList(UserEntity userEntity) {
        return userEntityMapper.queryUserList(userEntity);
    }

    public List<Map<String, Object>> queryUserListById(String[] ids) {
        List<Map<String, Object>> res = new ArrayList<>();
        for (String id: ids) {
            Map<String, Object> user = userEntityMapper.queryUserListById(id);
            if (user != null)
                res.add(user);
        }
        return res;
    }

    public List<Date> queryDateByName() {
        return userEntityMapper.queryDateByName();
    }
}
