import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { getAllRushees } from '../utils/api';
import { getBrotherData } from '../utils/auth';

// User-curated cringiest comments — edit this array to update the slide (same for all users)
const CRINGIEST_COMMENTS = [
  { content: "S** is a STAR. The new PC needs her. PGN needs her. Amazing energy", author: "Richard Ye" },
  { content: "we need some spice in the pc i think she's got it", author: "Patrick Yu" },
  { content: "i like this guy such a cutie pie", author: "Emily Yu" },
];

// User-curated most interesting interaction — 2 notes in a thread (same for all users)
const MOST_INTERESTING_INTERACTION = [
  { content: "So far the funniest rush for me. Reminds me a lot of freshman Olivia Zhao. Talks super slow but it's funny.", author: "Caleb Joo" },
  { content: "maybe we're too similar cus i couldn't jive", author: "Olivia Zhao" },
];

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #0d0d0d 0%, #1a1a2e 50%, #0d0d0d 100%);
  overflow: hidden;
  position: relative;
`;

const Slide = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out forwards;
`;

const Badge = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #1db954;
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
  max-width: 700px;

  @media (max-width: 600px) {
    gap: 1.5rem;
    grid-template-columns: 1fr;
  }
`;

const StatBlock = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 800;
  color: #1db954;
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
`;

const VoteSection = styled.div`
  max-width: 600px;
  width: 90%;
  margin: 1rem 0;
  padding: 1.25rem;
  border-radius: 8px;
  text-align: left;
  border-left: 4px solid ${props => props.$positive ? '#1db954' : '#e53e3e'};
  background: ${props => props.$positive ? 'rgba(29, 185, 84, 0.08)' : 'rgba(229, 62, 62, 0.08)'};
`;

const VoteLabel = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.$positive ? '#1db954' : '#e53e3e'};
  margin-bottom: 0.5rem;
`;

const VoteCount = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 0.5rem;
`;

const ThreadContainer = styled.div`
  max-width: 550px;
  margin-top: 1.5rem;
`;

const ThreadEntry = styled.div`
  margin: 1rem 0;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  text-align: left;
  border-left: 4px solid #1db954;
  margin-left: ${props => props.$reply ? '1.5rem' : '0'};
`;

const ThreadContent = styled.div`
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  color: rgba(255, 255, 255, 0.95);
  font-style: italic;
`;

const ThreadAuthor = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
`;

const TopCommenterNames = styled.div`
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
  max-width: 90%;
  line-height: 1.2;
  text-shadow: 0 0 40px rgba(29, 185, 84, 0.3);
`;

const TopCommenterCount = styled.span`
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  display: block;
  margin-bottom: 1rem;
`;

const RunnerUp = styled.div`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.85);
  margin-top: 0.5rem;
`;

const Title = styled.h2`
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  max-width: 90%;
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.6);
  margin-top: 1rem;
  max-width: 600px;
`;

const LongCommentAuthor = styled.div`
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 600;
  color: #1db954;
  margin-bottom: 1rem;
`;

const LongComment = styled.blockquote`
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: rgba(255, 255, 255, 0.95);
  font-style: italic;
  max-width: 700px;
  margin: 1.5rem auto 0;
  padding: 1.5rem;
  border-left: 4px solid #1db954;
  background: rgba(29, 185, 84, 0.08);
  border-radius: 0 8px 8px 0;
  text-align: left;
`;

const CringeList = styled.div`
  max-width: 600px;
  width: 90%;
  max-height: 60vh;
  overflow-y: auto;
  margin-top: 1rem;
`;

const CringeEntry = styled.div`
  margin: 1rem auto;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  text-align: left;
  border-left: 4px solid #e53e3e;
`;

const CringeContent = styled.div`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.95);
  font-style: italic;
`;

const CringeAuthor = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
`;

const ProgressDots = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => (props.$active ? '#1db954' : 'rgba(255,255,255,0.3)')};
  transition: all 0.3s ease;
`;

const Wrapped = () => {
  const navigate = useNavigate();
  const brother = getBrotherData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [stats, setStats] = useState({
    totalRushees: 0,
    totalEvents: 0,
    totalComments: 0,
    topCommentersRanked: [],
    longestComment: '',
    longestCommentAuthor: '',
    mostUpvoted: null,
    mostDownvoted: null
  });

  useEffect(() => {
    if (!brother) {
      navigate('/login');
    }
  }, [brother, navigate]);

  useEffect(() => {
    if (!brother?.frat) return;
    const fetchStats = async () => {
      try {
        const response = await getAllRushees({ fraternity: brother.frat });
        const rushees = response.data?.data || response.data || [];

        const allNotes = rushees.reduce((acc, rushee) => {
          return [...acc, ...(rushee.notes || []).map(n => ({ ...n, rusheeName: rushee.name }))];
        }, []);

        const totalComments = allNotes.length;
        const totalRushees = rushees.length;
        const eventIds = [...new Set(rushees.flatMap(r => (r.eventsAttended || []).map(e => e._id || e)))];
        const totalEvents = eventIds.length;

        const mostUpvoted = allNotes.reduce((best, note) => {
          const count = (note.upvotes || []).length;
          return count > (best?.upvoteCount || 0) ? { content: note.content, author: note.author?.name || 'Anonymous', upvoteCount: count } : best;
        }, null);

        const mostDownvoted = allNotes.reduce((best, note) => {
          const count = (note.downvotes || []).length;
          return count > (best?.downvoteCount || 0) ? { content: note.content, author: note.author?.name || 'Anonymous', downvoteCount: count } : best;
        }, null);

        const byAuthor = {};
        allNotes.forEach((note) => {
          const key = note.author?._id || note.author || 'anonymous';
          if (!byAuthor[key]) {
            byAuthor[key] = { count: 0, name: note.author?.name || 'Anonymous' };
          }
          byAuthor[key].count += 1;
        });

        const counts = Object.entries(byAuthor).map(([id, data]) => ({ id, ...data }));
        const topCommentersRanked = counts
          .sort((a, b) => b.count - a.count)
          .slice(0, 3)
          .map(({ name, count }) => ({ name, count }));

        const longest = allNotes.reduce((best, note) => {
          const len = (note.content || '').length;
          return len > (best?.content?.length || 0) ? note : best;
        }, null);

        setStats({
          totalRushees,
          totalEvents,
          totalComments,
          topCommentersRanked,
          longestComment: longest?.content || 'No comments yet.',
          longestCommentAuthor: longest?.author?.name || 'Anonymous',
          mostUpvoted,
          mostDownvoted
        });
      } catch (err) {
        console.error('Failed to fetch wrapped stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [brother?.frat]);

  const totalSlides = 6;
  const goNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, []);
  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(goNext, 10000);
    return () => clearInterval(interval);
  }, [loading, currentSlide, goNext]);

  useEffect(() => {
    if (loading) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, goNext, goPrev]);

  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) < minSwipeDistance) return;
    if (distance > 0) goNext();
    else goPrev();
  };

  const getSlideContent = (slideIndex) => {
    switch (slideIndex) {
      case 0:
        return (
          <>
            <Badge>Rush in Numbers</Badge>
            <Title>Your rush by the numbers</Title>
            <StatsGrid>
              <StatBlock>
                <StatNumber>{stats.totalRushees}</StatNumber>
                <StatLabel>Rushees</StatLabel>
              </StatBlock>
              <StatBlock>
                <StatNumber>{stats.totalEvents}</StatNumber>
                <StatLabel>Events</StatLabel>
              </StatBlock>
              <StatBlock>
                <StatNumber>{stats.totalComments}</StatNumber>
                <StatLabel>Comments</StatLabel>
              </StatBlock>
            </StatsGrid>
          </>
        );
      case 1:
        const [first, second, third] = stats.topCommentersRanked;
        return (
          <>
            <Badge>Top Contributors</Badge>
            <Title>Brothers with the most comments</Title>
            {first ? (
              <>
                <TopCommenterNames>{first.name}</TopCommenterNames>
                <TopCommenterCount>{first.count} comments</TopCommenterCount>
                {second && (
                  <RunnerUp>2. {second.name} — {second.count} comments</RunnerUp>
                )}
                {third && (
                  <RunnerUp>3. {third.name} — {third.count} comments</RunnerUp>
                )}
              </>
            ) : (
              <Subtitle>No comments yet.</Subtitle>
            )}
          </>
        );
      case 2:
        return (
          <>
            <Badge>Deep Cuts</Badge>
            <Title>Longest Comment</Title>
            <LongCommentAuthor>{stats.longestCommentAuthor}</LongCommentAuthor>
            <LongComment>
              "{stats.longestComment}"
            </LongComment>
          </>
        );
      case 3:
        const hasUpvoted = stats.mostUpvoted && stats.mostUpvoted.upvoteCount > 0;
        const hasDownvoted = stats.mostDownvoted && stats.mostDownvoted.downvoteCount > 0;
        return (
          <>
            <Badge>Community Picks</Badge>
            <Title>Most upvoted & most downvoted</Title>
            {hasUpvoted ? (
              <VoteSection $positive>
                <VoteLabel $positive>Most upvoted</VoteLabel>
                <ThreadContent>"{stats.mostUpvoted.content}"</ThreadContent>
                <ThreadAuthor>By: {stats.mostUpvoted.author}<VoteCount>({stats.mostUpvoted.upvoteCount} ▲)</VoteCount></ThreadAuthor>
              </VoteSection>
            ) : (
              <Subtitle>No upvotes yet.</Subtitle>
            )}
            {hasDownvoted ? (
              <VoteSection $positive={false}>
                <VoteLabel $positive={false}>Most downvoted</VoteLabel>
                <ThreadContent>"{stats.mostDownvoted.content}"</ThreadContent>
                <ThreadAuthor>By: {stats.mostDownvoted.author}<VoteCount>({stats.mostDownvoted.downvoteCount} ▼)</VoteCount></ThreadAuthor>
              </VoteSection>
            ) : (
              hasUpvoted && <Subtitle>No downvotes yet.</Subtitle>
            )}
            {!hasUpvoted && !hasDownvoted && <Subtitle>No votes yet.</Subtitle>}
          </>
        );
      case 4:
        return (
          <>
            <Badge>Most Interesting Interaction</Badge>
            <Title>A conversation for the books</Title>
            <ThreadContainer>
              {MOST_INTERESTING_INTERACTION.map(({ content, author }, i) => (
                <ThreadEntry key={i} $reply={i > 0}>
                  <ThreadContent>"{content}"</ThreadContent>
                  <ThreadAuthor>By: {author}</ThreadAuthor>
                </ThreadEntry>
              ))}
            </ThreadContainer>
          </>
        );
      case 5:
        return (
          <>
            <Badge>Cringiest Comments</Badge>
            <Title>We had to share these</Title>
            <CringeList>
              {CRINGIEST_COMMENTS.map(({ content, author }, i) => (
                <CringeEntry key={i}>
                  <CringeContent>"{content}"</CringeContent>
                  <CringeAuthor>By: {author}</CringeAuthor>
                </CringeEntry>
              ))}
            </CringeList>
          </>
        );
      default:
        return null;
    }
  };

  if (!brother) {
    return null;
  }

  if (loading) {
    return (
      <Container>
        <Slide>
          <Badge>Loading</Badge>
          <Title>Your Rush Wrapped</Title>
          <Subtitle>Preparing your stats...</Subtitle>
        </Slide>
      </Container>
    );
  }

  return (
    <Container
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Slide key={currentSlide}>
        {getSlideContent(currentSlide)}
      </Slide>

      <ProgressDots>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Dot key={i} $active={currentSlide === i} />
        ))}
      </ProgressDots>
    </Container>
  );
};

export default Wrapped;
