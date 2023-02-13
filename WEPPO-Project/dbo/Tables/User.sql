CREATE TABLE [dbo].[User] (
    [Id]       INT           IDENTITY (1, 1) NOT NULL,
    [username] VARCHAR (MAX) NOT NULL,
    [password] VARCHAR (MAX) NOT NULL,
    [admin]    BIT           NOT NULL,
    [cartID]   INT           NOT NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_User_Order] FOREIGN KEY ([Id]) REFERENCES [dbo].[Order] ([Id])
);

