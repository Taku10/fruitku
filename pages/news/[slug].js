import React,{useEffect} from 'react'
import { client, urlFor } from '../../lib/client'
import { BsFillPersonFill } from 'react-icons/bs'
import { MdDateRange } from 'react-icons/md'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import Link from 'next/link'
import Aos from 'aos'





const NewsDetails = ({ otherNews, news }) => {

  const { title, date, body1, body2, image } = news

  useEffect(()=>{
    Aos.init({duration:1500, once: true})
},[])

  return (
    <div className='news-details-container'>
      <div className='news-start-container'>
        <div className='news-start-header'>
          <p data-aos = 'fade-down' data-aos-delay='300'>READ MORE DETAILS</p>
          <h1 data-aos = 'fade-up' data-aos-delay='600'>Single Article</h1>
        </div>
      </div>
      <div className='single-article-container'>
        <div className='single-article-wrapper'>
          <div className='main-left-content'>
            <div className='single-article-image'>
              <img src={urlFor(image && image[0])} />
            </div>
            <div className='article-meta'>
              <div className='admin'>
                <BsFillPersonFill />
                <p>Admin</p>
              </div>
              <div className="published-date">
                <MdDateRange />
                <p>{date}</p>
              </div>
            </div>
            <h1 className='single-article-title'>{title}</h1>
            <div className='single-article-body'>
              <p className='body-1'>{body1}</p>
              <p className='body-2'>{body2}</p>
            </div>

          </div>
          <div className='other-right-content'>
            <h1 className='recent-post'>Recent Posts</h1>
            <div className='other-posts'>
              {otherNews.map((item) => (
                <Link key={item.slug.current} href={`/news/${item.slug.current}`}>
                  <div className='post-link'>
                    <MdOutlineKeyboardArrowRight className='other-post-arrow' />
                    <p>{item.title}</p>
                  </div>
                </Link>
              ))}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const newsQuery = `*[_type == "news"]{
        slug {
        current
      }
    }`

  const news = await client.fetch(newsQuery)
  const paths = news.map((item) => ({
    params: {
      slug: item.slug.current
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}


export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "news" && slug.current == '${slug}'][0]`
  const relatedQuery = '*[_type == "news"]'
  const news = await client.fetch(query);
  const otherNews = await client.fetch(relatedQuery);

  return {
    props: { otherNews, news }
  }
}

export default NewsDetails
