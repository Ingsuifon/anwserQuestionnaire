package com.aim.questionnaire.controller;

import com.aim.questionnaire.beans.HttpResponseEntity;
import com.aim.questionnaire.common.Constans;
import com.aim.questionnaire.common.utils.DateUtil;
import com.aim.questionnaire.common.utils.GsonUtils;
import com.aim.questionnaire.common.utils.HttpUtil;
import com.aim.questionnaire.dao.entity.UserEntity;
import com.aim.questionnaire.service.UserService;
import com.baidu.aip.face.AipFace;
import com.baidu.aip.util.Base64Util;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONObject;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;
import java.util.*;

/**
 * @author: Ingsuifon
 **/
@RestController
@RequestMapping("/admin")
public class UserController {
    private static final String APP_ID = "24370455";
    private static final String API_KEY = "Ebgvr5Fq5zrIAmnLI8uINWDH";
    private static final String SECRET_KEY = "05VvCwy4lEayVT8RKSOylnyoMPBw9TQ5";
    private static final AipFace client;

    @Autowired
    private UserService userService;

    static  {
        client = new AipFace(APP_ID, API_KEY, SECRET_KEY);
        client.setConnectionTimeoutInMillis(2000);
        client.setSocketTimeoutInMillis(60000);
    }

    @RequestMapping(value = "/userLogin", method = RequestMethod.POST)
    public HttpResponseEntity userLogin(@RequestBody Map<String, Object> map) {
        HttpResponseEntity httpResponseEntity = new HttpResponseEntity();
        String username = map.get("username").toString();
        String password = map.get("password").toString();
        UserEntity hasUser = userService.selectAllByName(username);
        if (password.equals(hasUser.getPassword())) {
            httpResponseEntity.setData(hasUser);
            httpResponseEntity.setCode(Constans.SUCCESS_CODE);
            httpResponseEntity.setMessage("登陆成功");
        }
        else {
            httpResponseEntity.setData(hasUser);
            httpResponseEntity.setCode(Constans.SUCCESS_CODE);
            httpResponseEntity.setMessage("登陆失败");
        }
        return httpResponseEntity;
    }

    @RequestMapping("/addUserInfo")
    public HttpResponseEntity addUserInfo(@RequestBody UserEntity userEntity) {
        HttpResponseEntity httpResponseEntity = new HttpResponseEntity();
        userEntity.setId(userEntity.getUsername());
        userService.addUserInfo(userEntity);
        httpResponseEntity.setCode(Constans.SUCCESS_CODE);
        return httpResponseEntity;
    }

    @RequestMapping("/queryUserList")
    public HttpResponseEntity queryUserList(@RequestBody(required = false) UserEntity userEntity) {
        System.out.println(userEntity.getUsername());
        HttpResponseEntity httpResponseEntity = new HttpResponseEntity();
        Map<String, Object> res = new HashMap<>();
        List<Map<String, Object>> list = userService.queryUserList(userEntity);
        res.put("list", list);
        httpResponseEntity.setData(res);
        httpResponseEntity.setCode(Constans.SUCCESS_CODE);
        return httpResponseEntity;
    }

    @RequestMapping("/addUserInfoList")
    public HttpResponseEntity addUserInfoList(@RequestBody Map<String, List<UserEntity>> map) {
        HttpResponseEntity res = new HttpResponseEntity();
        System.out.println(map.get("userList").size());
        for (UserEntity user: map.get("userList")) {
            userService.addUserInfo(user);
        }
        res.setCode(Constans.SUCCESS_CODE);
        return res;
    }

    @RequestMapping("/selectUserListToExcel")
    public void batchExport(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String[] ids = (request.getHeader("ids") + "&").split("&");
        List<Map<String, Object>> userEntities = userService.queryUserListById(ids);
        XSSFWorkbook xlsx = new XSSFWorkbook();
        XSSFSheet sheet = xlsx.createSheet("exportInfo");
        Row head = sheet.createRow(0);
        String[] titles = {"id", "username", "password", "startTime", "stopTime", "status",
                            "createdBy", "creationDate", "lastUpdatedBy", "lastUpdateDate"};
        for (int i = 0; i < titles.length; i++)
            head.createCell(i).setCellValue(titles[i]);
        short columnCount = head.getLastCellNum();
        for (int rowId = 0; rowId < userEntities.size(); rowId++) {
            Map<String, Object> map = userEntities.get(rowId);
            Row newRow = sheet.createRow(rowId + 1);
            for (short columnIndex = 0; columnIndex < columnCount; columnIndex++)
                newRow.createCell(columnIndex).setCellValue(map.get(titles[columnIndex]) == null ? null : map.get(titles[columnIndex]).toString());
        }
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment;filename=export.xlsx");
        xlsx.write(response.getOutputStream());
    }

    @RequestMapping("/faceLogin")
    public HttpResponseEntity faceLogin(@RequestBody Map<String, String> m) throws IOException {
        HttpResponseEntity httpResponseEntity = new HttpResponseEntity();
        String img = m.get("photo");
        List<Map<String, String>> map = new ArrayList<>();
        Map<String, String> p1 = new HashMap<>(), p2 = new HashMap<>();
        p1.put("image", img);
        p1.put("image_type", "BASE64");
        p1.put("face_type", "LIVE");
        p1.put("quality_control", "LOW");
        map.add(p1);

        File localPhoto = new File(this.getClass().getClassLoader().getResource("test.jpg").getPath());
        String img2 = Base64Util.encode(FileToByte(localPhoto));
        p2.put("image", img2);
        p2.put("image_type", "BASE64");
        p2.put("face_type", "LIVE");
        p2.put("quality_control", "LOW");
        map.add(p2);

        String url = "https://aip.baidubce.com/rest/2.0/face/v3/match";
        try {

            String param = GsonUtils.toJson(map);

            // 注意这里仅为了简化编码每一次请求都去获取access_token，线上环境access_token有过期时间， 客户端可自行缓存，过期后重新获取。
            String accessToken = "24.a30e137d2a902ac860cae950f817ed0e.2592000.1626336010.282335-24370455";

            String result = HttpUtil.post(url, accessToken, "application/json", param);
            JSONObject res = new JSONObject(result);
            if (res.getJSONObject("result").getDouble("score") > 90) {
                //httpResponseEntity.setData(res);
                httpResponseEntity.setCode(Constans.SUCCESS_CODE);
                httpResponseEntity.setMessage("Success");
            }
            else
                httpResponseEntity.setCode("-1");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return httpResponseEntity;
    }

    private static JSONObject searchFace(String imgStr, String groupIdList, String userId) {
        String imageType = "BASE64";
        HashMap<String, String> options = new HashMap<>();
        options.put("quality_control", "NORMAL");
        options.put("liveness_control", "LOW");
        options.put("user_id", "admin");
        options.put("max_user_num", "3");
        return client.search(imgStr, imageType, groupIdList, options);
    }

    private static byte[] FileToByte(File file) throws IOException {
        // 将数据转为流
        @SuppressWarnings("resource")
        InputStream content = new FileInputStream(file);
        ByteArrayOutputStream swapStream = new ByteArrayOutputStream();
        byte[] buff = new byte[100];
        int rc = 0;
        while ((rc = content.read(buff, 0, 100)) > 0) {
            swapStream.write(buff, 0, rc);
        }
        // 获得二进制数组
        return swapStream.toByteArray();
    }

    @RequestMapping("/date")
    public void queryDateName() {
        System.out.println("Haha " + userService.queryDateByName());
    }
}