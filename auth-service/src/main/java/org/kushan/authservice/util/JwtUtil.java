package org.kushan.authservice.util;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.SignatureException;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key secretKey;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        byte[] keybytes = Base64.getDecoder().decode(secret.getBytes(
                StandardCharsets.UTF_8));
        this.secretKey = Keys.hmacShaKeyFor(keybytes);
    }

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(secretKey)
                .compact();

    }

    public void validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) secretKey)
                    .build()
                    .parseSignedClaims(token);
        } catch (SecurityException e) {
            // Specifically for signature validation failures
            throw new JwtException("Invalid JWT signature");
        } catch (MalformedJwtException e) {
            throw new JwtException("Malformed JWT");
        } catch (ExpiredJwtException e) {
            throw new JwtException("Expired JWT");
        } catch (JwtException e) {
            throw new JwtException("Invalid JWT");
        }
    }
}
