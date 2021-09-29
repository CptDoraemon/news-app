import useRequestState from "../../tools/use-request-state";
import {useMount} from "react-use";
import {ArticleData} from "../articles/use-load-articles";
import axios from "axios";
import {getBaseAPI} from "../../routers";

const useGetArticleById = (id: string) => {
  const request = useRequestState<ArticleData[]>();

  useMount(async () => {
    try {
      if (!id) return;
      request.setIsLoading(true);
      const res = await axios.get(`${getBaseAPI()}/api/search-news/id`, {
        params: {id}
      });
      request.setData(res.data.doc)
    } catch (e) {
      request.setGenericErrorMessage()
    } finally {
      request.setIsLoading(false);
    }
  })

  return request
}

export default useGetArticleById
