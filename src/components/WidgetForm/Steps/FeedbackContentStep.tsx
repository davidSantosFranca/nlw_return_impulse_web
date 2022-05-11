import { ArrowLeft } from "phosphor-react";
import { FormEvent, useState } from "react";
import { FeedbackType, feedbackTypes } from "..";
import { api } from "../../../libs/api";
import { CloseButton } from "../../CloseButton";
import { Loading } from "../Loading";
import { ScreenshotButton } from "./ScreenshotButton";

interface FeedbackContentStepProps {
  feedbackType: FeedbackType;
  onFeedbackRestartRequested: () => void;
  onFeedbackSent: () => void;
}

export function FeedbackContentStep({
  feedbackType,
  onFeedbackRestartRequested,
  onFeedbackSent,
}: FeedbackContentStepProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isTakingScreenshot, setIsTakingScreenshot] = useState(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  const feedbackTypeInfo = feedbackTypes[feedbackType];

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSendingFeedback(true);
    try{
      await api.post('/feedbacks',{
      type: feedbackType,
      comment: comment,
      screenshot: screenshot
    })
    }
    catch(error){
      console.log("Error while posting feedback", error)
    }

    onFeedbackSent();
    setIsSendingFeedback(false);
  }

  return (
    <>
      <header>
        <button
          type="button"
          className="top5 left-5 absolute text-zinc-400 hover:text-zinc-100"
          onClick={onFeedbackRestartRequested}
        >
          <ArrowLeft weight="bold" className="w4 h4" />
        </button>
        <span className="text-xl leading-6 flex items-center gap-2">
          <img
            src={feedbackTypeInfo.image.source}
            alt={feedbackTypeInfo.image.alt}
            className="w-6 h-6"
          />

          {feedbackTypeInfo.title}
        </span>

        <CloseButton></CloseButton>
      </header>

      <form className="my-4 w-full">
        <textarea
          className="min-w-[100px] w-full min-h-[112px] text-sm placeholder-zinc-400 
          text-zinc-100 border-zinc-600 bg-transparent rounded-md focus:border-brand-500 
          focus:ring-brand-500 focus:outline-none 
          focus:ring-1 resize-none scrollbar scrollbar-thumb-zinc-700 
          scrollbar-track-transparent scrollbar-w-3"
          onChange={(event) => setComment(event.target.value)}
          placeholder="Conte com detalhes o que está acontecento..."
        />

        <footer className="flex gap-2 mt-2">
          <ScreenshotButton
            onScreenshotTook={setScreenshot}
            screenshot={screenshot}
            setIsTakingScreenshot = {setIsTakingScreenshot}
            isTakingScreenshot = {isTakingScreenshot}
          />
          <button
            type="submit"
            disabled={comment.length === 0 || isTakingScreenshot || isSendingFeedback}
            onClick={handleSubmit}
            className="p-2 bg-brand-500 rounded-md border-transparent flex-1 
              flex justify-center items center text-sm hover:bg-brand-300
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900
              focus:ring-brand-500 transition-colors
              disabled:opacity-50 disabled:hover:bg-brand-500"
          >
            {isSendingFeedback
            ?<Loading/>
            :'Enviar feedback'}
          </button>
        </footer>
      </form>
    </>
  );
}