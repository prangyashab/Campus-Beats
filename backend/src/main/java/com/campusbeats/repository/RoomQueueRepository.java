package com.campusbeats.repository;

import com.campusbeats.entity.ListeningRoom;
import com.campusbeats.entity.RoomQueue;
import com.campusbeats.entity.Track;
import com.campusbeats.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomQueueRepository extends JpaRepository<RoomQueue, Long> {
    
    List<RoomQueue> findByListeningRoomOrderByQueueOrderAsc(ListeningRoom listeningRoom);
    
    List<RoomQueue> findByListeningRoomOrderByVoteCountDescQueueOrderAsc(ListeningRoom listeningRoom);
    
    Optional<RoomQueue> findByListeningRoomAndTrackAndAddedBy(ListeningRoom listeningRoom, Track track, User addedBy);
    
    @Query("SELECT rq FROM RoomQueue rq WHERE rq.listeningRoom.id = :roomId ORDER BY rq.voteCount DESC, rq.queueOrder ASC")
    List<RoomQueue> findQueueByRoomOrderByVotes(@Param("roomId") Long roomId);
    
    @Query("SELECT rq FROM RoomQueue rq JOIN rq.voters v WHERE v.id = :userId AND rq.listeningRoom.id = :roomId")
    List<RoomQueue> findUserVotesInRoom(@Param("userId") Long userId, @Param("roomId") Long roomId);
    
    @Query("SELECT MAX(rq.queueOrder) FROM RoomQueue rq WHERE rq.listeningRoom.id = :roomId")
    Optional<Integer> findMaxQueueOrderByRoom(@Param("roomId") Long roomId);
    
    void deleteByListeningRoomAndTrack(ListeningRoom listeningRoom, Track track);
}