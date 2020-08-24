import { useMemo } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

export const CHECK_DAILY_QUESTIONS = gql`
  query CheckDailyQuestions {
    journal_questions(limit: 1) {
      id
    }
  }
`;

export const CREATE_WELCOME_QUESTIONS = gql`
  mutation CreateelcomeQuestions {
    insert_journal_questions(
      objects: [
        {
          text: "What is today's best happening?"
          type: "text"
          order: 1
          data: { rows: 2, maxlength: 140 }
          show_in_journal: true
        }
        {
          text: "What am I grateful for?"
          type: "text"
          order: 2
          data: { rows: 2, maxlength: 140 }
        }
      ]
    ) {
      returning {
        id
      }
    }
  }
`;

const useWelcomeQuestions = () => {
  const checkQuestions = useQuery(CHECK_DAILY_QUESTIONS);

  const [createWelcomeQuestions] = useMutation(CREATE_WELCOME_QUESTIONS, {
    update: (cache, res) => {
      const gql = {
        query: CHECK_DAILY_QUESTIONS
      };
      try {
        const { journal_questions } = cache.readQuery(gql);
        cache.writeQuery({
          ...gql,
          data: {
            journal_questions: [
              ...res.data.insert_journal_questions.returning,
              ...journal_questions
            ]
          }
        });
      } catch (err) {
        console.error("@@updateCacheAfterCreateJournalQuestions");
        console.error(err);
      }
    }
  });

  const showWelcome = useMemo(() => {
    const { loading, data } = checkQuestions;
    if (loading) return false;
    if (!data) return false;

    if (data.journal_questions.length) return false;
    return true;
  }, [checkQuestions]);

  return {
    showWelcome,
    createWelcomeQuestions
  };
};

export default useWelcomeQuestions;
