package security;

import java.security.Key;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final Key signingKey;
    private final long expirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expirationMs
    ) {
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expirationMs = expirationMs;
    }

    public String generateToken(String username, Long userId, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(username)
                .claim("uid", userId)
                .claim("role", role)
                .claim("login_time", now.getTime())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (RuntimeException ex) {
            return false;
        }
    }

    public String getUsername(String token) {
        return parseClaims(token).getSubject();
    }

    public Long getUserId(String token) {
        Object uid = parseClaims(token).get("uid");
        if (uid == null) return null;
        if (uid instanceof Integer i) return i.longValue();
        if (uid instanceof Long l) return l;
        return Long.parseLong(uid.toString());
    }

    public String getRole(String token) {
        Object role = parseClaims(token).get("role");
        return role != null ? role.toString() : "USER";
    }

    public LocalDateTime getLoginTime(String token) {
        Claims claims = parseClaims(token);
        Object loginTime = claims.get("login_time");
        if (loginTime instanceof Number number) {
            return LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(number.longValue()),
                    ZoneId.systemDefault()
            );
        }
        Date issuedAt = claims.getIssuedAt();
        if (issuedAt != null) {
            return LocalDateTime.ofInstant(issuedAt.toInstant(), ZoneId.systemDefault());
        }
        return LocalDateTime.now();
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

