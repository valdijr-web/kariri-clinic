import SignupForm from '@/components/signup-form';
import logo from '../../../components/logo-kariri-saude.png';
import Image from "next/image"
import { GalleryVerticalEnd, InboxIcon, StarIcon, PhoneIcon, GlobeIcon, CreditCardIcon } from 'lucide-react';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

export const metadata = {
  title: "Cadastro de Usuário | Kariri Clinic",
  description: "Crie sua conta em nossa plataforma",
};

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">

        <div className="flex h-full min-h-svh max-w-md flex-col gap-6 items-center justify-center mx-auto">

          <div className="flex w-full justify-center rounded-md">
            <div className="w-1/4"> {/* Mantive a proporção que você definiu para a logo */}
              <Image src={logo} alt="Logo Kariri Saúde" />
            </div>
          </div>
          <Item variant="outline" className='w-full'>
            <ItemMedia variant="icon">
              <StarIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Tudo em um só lugar</ItemTitle>
              <ItemDescription>
                Faça a gestão completa da sua clínica. Agendamento, prontuário, financeiro e muito mais.
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <PhoneIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Suporte com 95% de satisfação desde o primeiro dia</ItemTitle>
              <ItemDescription>Seja por telefone, chat*, email, ticket, whatsapp*...</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <GlobeIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Sistema 100% online</ItemTitle>
              <ItemDescription>Acesse o Bling a qualquer hora, de qualquer lugar!</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="outline">
            <ItemMedia variant="icon">
              <CreditCardIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Sem cobranças surpresa!</ItemTitle>
              <ItemDescription>Comece seu teste grátis sem cadastrar cartão de crédito, escolha seu plano e troque quando quiser</ItemDescription>
            </ItemContent>
          </Item>
        </div>
      </div>
    </div>
  )
}