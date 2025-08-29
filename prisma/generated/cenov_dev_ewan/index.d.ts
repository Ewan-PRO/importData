
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model categorie
 * 
 */
export type categorie = $Result.DefaultSelection<Prisma.$categoriePayload>
/**
 * Model categorie_attribut_cenov_dev_ewan
 * 
 */
export type categorie_attribut_cenov_dev_ewan = $Result.DefaultSelection<Prisma.$categorie_attribut_cenov_dev_ewanPayload>
/**
 * Model cross_ref
 * 
 */
export type cross_ref = $Result.DefaultSelection<Prisma.$cross_refPayload>
/**
 * Model famille
 * 
 */
export type famille = $Result.DefaultSelection<Prisma.$famillePayload>
/**
 * Model produit
 * 
 */
export type produit = $Result.DefaultSelection<Prisma.$produitPayload>
/**
 * Model produit_categorie_cenov_dev_ewan
 * 
 */
export type produit_categorie_cenov_dev_ewan = $Result.DefaultSelection<Prisma.$produit_categorie_cenov_dev_ewanPayload>
/**
 * Model tarif_achat_cenov_dev_ewan
 * 
 */
export type tarif_achat_cenov_dev_ewan = $Result.DefaultSelection<Prisma.$tarif_achat_cenov_dev_ewanPayload>
/**
 * Model attribut_cenov_dev_ewan
 * 
 */
export type attribut_cenov_dev_ewan = $Result.DefaultSelection<Prisma.$attribut_cenov_dev_ewanPayload>
/**
 * Model fournisseur
 * 
 */
export type fournisseur = $Result.DefaultSelection<Prisma.$fournisseurPayload>
/**
 * Model kit_cenov_dev_ewan
 * 
 */
export type kit_cenov_dev_ewan = $Result.DefaultSelection<Prisma.$kit_cenov_dev_ewanPayload>
/**
 * Model kit_attribute_cenov_dev_ewan
 * 
 */
export type kit_attribute_cenov_dev_ewan = $Result.DefaultSelection<Prisma.$kit_attribute_cenov_dev_ewanPayload>
/**
 * Model part_nc_cenov_dev_ewan
 * 
 */
export type part_nc_cenov_dev_ewan = $Result.DefaultSelection<Prisma.$part_nc_cenov_dev_ewanPayload>
/**
 * Model famille_ewan
 * 
 */
export type famille_ewan = $Result.DefaultSelection<Prisma.$famille_ewanPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Categories
 * const categories = await prisma.categorie.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Categories
   * const categories = await prisma.categorie.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.categorie`: Exposes CRUD operations for the **categorie** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.categorie.findMany()
    * ```
    */
  get categorie(): Prisma.categorieDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.categorie_attribut_cenov_dev_ewan`: Exposes CRUD operations for the **categorie_attribut_cenov_dev_ewan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categorie_attribut_cenov_dev_ewans
    * const categorie_attribut_cenov_dev_ewans = await prisma.categorie_attribut_cenov_dev_ewan.findMany()
    * ```
    */
  get categorie_attribut_cenov_dev_ewan(): Prisma.categorie_attribut_cenov_dev_ewanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cross_ref`: Exposes CRUD operations for the **cross_ref** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cross_refs
    * const cross_refs = await prisma.cross_ref.findMany()
    * ```
    */
  get cross_ref(): Prisma.cross_refDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.famille`: Exposes CRUD operations for the **famille** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Familles
    * const familles = await prisma.famille.findMany()
    * ```
    */
  get famille(): Prisma.familleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.produit`: Exposes CRUD operations for the **produit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Produits
    * const produits = await prisma.produit.findMany()
    * ```
    */
  get produit(): Prisma.produitDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.produit_categorie_cenov_dev_ewan`: Exposes CRUD operations for the **produit_categorie_cenov_dev_ewan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Produit_categorie_cenov_dev_ewans
    * const produit_categorie_cenov_dev_ewans = await prisma.produit_categorie_cenov_dev_ewan.findMany()
    * ```
    */
  get produit_categorie_cenov_dev_ewan(): Prisma.produit_categorie_cenov_dev_ewanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tarif_achat_cenov_dev_ewan`: Exposes CRUD operations for the **tarif_achat_cenov_dev_ewan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tarif_achat_cenov_dev_ewans
    * const tarif_achat_cenov_dev_ewans = await prisma.tarif_achat_cenov_dev_ewan.findMany()
    * ```
    */
  get tarif_achat_cenov_dev_ewan(): Prisma.tarif_achat_cenov_dev_ewanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.attribut_cenov_dev_ewan`: Exposes CRUD operations for the **attribut_cenov_dev_ewan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Attribut_cenov_dev_ewans
    * const attribut_cenov_dev_ewans = await prisma.attribut_cenov_dev_ewan.findMany()
    * ```
    */
  get attribut_cenov_dev_ewan(): Prisma.attribut_cenov_dev_ewanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.fournisseur`: Exposes CRUD operations for the **fournisseur** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Fournisseurs
    * const fournisseurs = await prisma.fournisseur.findMany()
    * ```
    */
  get fournisseur(): Prisma.fournisseurDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kit_cenov_dev_ewan`: Exposes CRUD operations for the **kit_cenov_dev_ewan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Kit_cenov_dev_ewans
    * const kit_cenov_dev_ewans = await prisma.kit_cenov_dev_ewan.findMany()
    * ```
    */
  get kit_cenov_dev_ewan(): Prisma.kit_cenov_dev_ewanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kit_attribute_cenov_dev_ewan`: Exposes CRUD operations for the **kit_attribute_cenov_dev_ewan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Kit_attribute_cenov_dev_ewans
    * const kit_attribute_cenov_dev_ewans = await prisma.kit_attribute_cenov_dev_ewan.findMany()
    * ```
    */
  get kit_attribute_cenov_dev_ewan(): Prisma.kit_attribute_cenov_dev_ewanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.part_nc_cenov_dev_ewan`: Exposes CRUD operations for the **part_nc_cenov_dev_ewan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Part_nc_cenov_dev_ewans
    * const part_nc_cenov_dev_ewans = await prisma.part_nc_cenov_dev_ewan.findMany()
    * ```
    */
  get part_nc_cenov_dev_ewan(): Prisma.part_nc_cenov_dev_ewanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.famille_ewan`: Exposes CRUD operations for the **famille_ewan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Famille_ewans
    * const famille_ewans = await prisma.famille_ewan.findMany()
    * ```
    */
  get famille_ewan(): Prisma.famille_ewanDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.14.0
   * Query Engine version: 717184b7b35ea05dfa71a3236b7af656013e1e49
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    categorie: 'categorie',
    categorie_attribut_cenov_dev_ewan: 'categorie_attribut_cenov_dev_ewan',
    cross_ref: 'cross_ref',
    famille: 'famille',
    produit: 'produit',
    produit_categorie_cenov_dev_ewan: 'produit_categorie_cenov_dev_ewan',
    tarif_achat_cenov_dev_ewan: 'tarif_achat_cenov_dev_ewan',
    attribut_cenov_dev_ewan: 'attribut_cenov_dev_ewan',
    fournisseur: 'fournisseur',
    kit_cenov_dev_ewan: 'kit_cenov_dev_ewan',
    kit_attribute_cenov_dev_ewan: 'kit_attribute_cenov_dev_ewan',
    part_nc_cenov_dev_ewan: 'part_nc_cenov_dev_ewan',
    famille_ewan: 'famille_ewan'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    cenov_dev_ewan_db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "categorie" | "categorie_attribut_cenov_dev_ewan" | "cross_ref" | "famille" | "produit" | "produit_categorie_cenov_dev_ewan" | "tarif_achat_cenov_dev_ewan" | "attribut_cenov_dev_ewan" | "fournisseur" | "kit_cenov_dev_ewan" | "kit_attribute_cenov_dev_ewan" | "part_nc_cenov_dev_ewan" | "famille_ewan"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      categorie: {
        payload: Prisma.$categoriePayload<ExtArgs>
        fields: Prisma.categorieFieldRefs
        operations: {
          findUnique: {
            args: Prisma.categorieFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoriePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.categorieFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoriePayload>
          }
          findFirst: {
            args: Prisma.categorieFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoriePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.categorieFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoriePayload>
          }
          findMany: {
            args: Prisma.categorieFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoriePayload>[]
          }
          create: {
            args: Prisma.categorieCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoriePayload>
          }
          createMany: {
            args: Prisma.categorieCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.categorieCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoriePayload>[]
          }
          delete: {
            args: Prisma.categorieDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoriePayload>
          }
          update: {
            args: Prisma.categorieUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoriePayload>
          }
          deleteMany: {
            args: Prisma.categorieDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.categorieUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.categorieUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoriePayload>[]
          }
          upsert: {
            args: Prisma.categorieUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categoriePayload>
          }
          aggregate: {
            args: Prisma.CategorieAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategorie>
          }
          groupBy: {
            args: Prisma.categorieGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategorieGroupByOutputType>[]
          }
          count: {
            args: Prisma.categorieCountArgs<ExtArgs>
            result: $Utils.Optional<CategorieCountAggregateOutputType> | number
          }
        }
      }
      categorie_attribut_cenov_dev_ewan: {
        payload: Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>
        fields: Prisma.categorie_attribut_cenov_dev_ewanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.categorie_attribut_cenov_dev_ewanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.categorie_attribut_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload>
          }
          findFirst: {
            args: Prisma.categorie_attribut_cenov_dev_ewanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.categorie_attribut_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload>
          }
          findMany: {
            args: Prisma.categorie_attribut_cenov_dev_ewanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload>[]
          }
          create: {
            args: Prisma.categorie_attribut_cenov_dev_ewanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload>
          }
          createMany: {
            args: Prisma.categorie_attribut_cenov_dev_ewanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.categorie_attribut_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload>[]
          }
          delete: {
            args: Prisma.categorie_attribut_cenov_dev_ewanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload>
          }
          update: {
            args: Prisma.categorie_attribut_cenov_dev_ewanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload>
          }
          deleteMany: {
            args: Prisma.categorie_attribut_cenov_dev_ewanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.categorie_attribut_cenov_dev_ewanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.categorie_attribut_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload>[]
          }
          upsert: {
            args: Prisma.categorie_attribut_cenov_dev_ewanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload>
          }
          aggregate: {
            args: Prisma.Categorie_attribut_cenov_dev_ewanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategorie_attribut_cenov_dev_ewan>
          }
          groupBy: {
            args: Prisma.categorie_attribut_cenov_dev_ewanGroupByArgs<ExtArgs>
            result: $Utils.Optional<Categorie_attribut_cenov_dev_ewanGroupByOutputType>[]
          }
          count: {
            args: Prisma.categorie_attribut_cenov_dev_ewanCountArgs<ExtArgs>
            result: $Utils.Optional<Categorie_attribut_cenov_dev_ewanCountAggregateOutputType> | number
          }
        }
      }
      cross_ref: {
        payload: Prisma.$cross_refPayload<ExtArgs>
        fields: Prisma.cross_refFieldRefs
        operations: {
          findUnique: {
            args: Prisma.cross_refFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$cross_refPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.cross_refFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$cross_refPayload>
          }
          findFirst: {
            args: Prisma.cross_refFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$cross_refPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.cross_refFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$cross_refPayload>
          }
          findMany: {
            args: Prisma.cross_refFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$cross_refPayload>[]
          }
          create: {
            args: Prisma.cross_refCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$cross_refPayload>
          }
          createMany: {
            args: Prisma.cross_refCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.cross_refCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$cross_refPayload>[]
          }
          delete: {
            args: Prisma.cross_refDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$cross_refPayload>
          }
          update: {
            args: Prisma.cross_refUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$cross_refPayload>
          }
          deleteMany: {
            args: Prisma.cross_refDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.cross_refUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.cross_refUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$cross_refPayload>[]
          }
          upsert: {
            args: Prisma.cross_refUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$cross_refPayload>
          }
          aggregate: {
            args: Prisma.Cross_refAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCross_ref>
          }
          groupBy: {
            args: Prisma.cross_refGroupByArgs<ExtArgs>
            result: $Utils.Optional<Cross_refGroupByOutputType>[]
          }
          count: {
            args: Prisma.cross_refCountArgs<ExtArgs>
            result: $Utils.Optional<Cross_refCountAggregateOutputType> | number
          }
        }
      }
      famille: {
        payload: Prisma.$famillePayload<ExtArgs>
        fields: Prisma.familleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.familleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famillePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.familleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famillePayload>
          }
          findFirst: {
            args: Prisma.familleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famillePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.familleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famillePayload>
          }
          findMany: {
            args: Prisma.familleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famillePayload>[]
          }
          create: {
            args: Prisma.familleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famillePayload>
          }
          createMany: {
            args: Prisma.familleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.familleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famillePayload>[]
          }
          delete: {
            args: Prisma.familleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famillePayload>
          }
          update: {
            args: Prisma.familleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famillePayload>
          }
          deleteMany: {
            args: Prisma.familleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.familleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.familleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famillePayload>[]
          }
          upsert: {
            args: Prisma.familleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famillePayload>
          }
          aggregate: {
            args: Prisma.FamilleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFamille>
          }
          groupBy: {
            args: Prisma.familleGroupByArgs<ExtArgs>
            result: $Utils.Optional<FamilleGroupByOutputType>[]
          }
          count: {
            args: Prisma.familleCountArgs<ExtArgs>
            result: $Utils.Optional<FamilleCountAggregateOutputType> | number
          }
        }
      }
      produit: {
        payload: Prisma.$produitPayload<ExtArgs>
        fields: Prisma.produitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.produitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.produitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produitPayload>
          }
          findFirst: {
            args: Prisma.produitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.produitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produitPayload>
          }
          findMany: {
            args: Prisma.produitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produitPayload>[]
          }
          create: {
            args: Prisma.produitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produitPayload>
          }
          createMany: {
            args: Prisma.produitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.produitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produitPayload>[]
          }
          delete: {
            args: Prisma.produitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produitPayload>
          }
          update: {
            args: Prisma.produitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produitPayload>
          }
          deleteMany: {
            args: Prisma.produitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.produitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.produitUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produitPayload>[]
          }
          upsert: {
            args: Prisma.produitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produitPayload>
          }
          aggregate: {
            args: Prisma.ProduitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduit>
          }
          groupBy: {
            args: Prisma.produitGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProduitGroupByOutputType>[]
          }
          count: {
            args: Prisma.produitCountArgs<ExtArgs>
            result: $Utils.Optional<ProduitCountAggregateOutputType> | number
          }
        }
      }
      produit_categorie_cenov_dev_ewan: {
        payload: Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>
        fields: Prisma.produit_categorie_cenov_dev_ewanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.produit_categorie_cenov_dev_ewanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produit_categorie_cenov_dev_ewanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.produit_categorie_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produit_categorie_cenov_dev_ewanPayload>
          }
          findFirst: {
            args: Prisma.produit_categorie_cenov_dev_ewanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produit_categorie_cenov_dev_ewanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.produit_categorie_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produit_categorie_cenov_dev_ewanPayload>
          }
          findMany: {
            args: Prisma.produit_categorie_cenov_dev_ewanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produit_categorie_cenov_dev_ewanPayload>[]
          }
          create: {
            args: Prisma.produit_categorie_cenov_dev_ewanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produit_categorie_cenov_dev_ewanPayload>
          }
          createMany: {
            args: Prisma.produit_categorie_cenov_dev_ewanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.produit_categorie_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produit_categorie_cenov_dev_ewanPayload>[]
          }
          delete: {
            args: Prisma.produit_categorie_cenov_dev_ewanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produit_categorie_cenov_dev_ewanPayload>
          }
          update: {
            args: Prisma.produit_categorie_cenov_dev_ewanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produit_categorie_cenov_dev_ewanPayload>
          }
          deleteMany: {
            args: Prisma.produit_categorie_cenov_dev_ewanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.produit_categorie_cenov_dev_ewanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.produit_categorie_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produit_categorie_cenov_dev_ewanPayload>[]
          }
          upsert: {
            args: Prisma.produit_categorie_cenov_dev_ewanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$produit_categorie_cenov_dev_ewanPayload>
          }
          aggregate: {
            args: Prisma.Produit_categorie_cenov_dev_ewanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProduit_categorie_cenov_dev_ewan>
          }
          groupBy: {
            args: Prisma.produit_categorie_cenov_dev_ewanGroupByArgs<ExtArgs>
            result: $Utils.Optional<Produit_categorie_cenov_dev_ewanGroupByOutputType>[]
          }
          count: {
            args: Prisma.produit_categorie_cenov_dev_ewanCountArgs<ExtArgs>
            result: $Utils.Optional<Produit_categorie_cenov_dev_ewanCountAggregateOutputType> | number
          }
        }
      }
      tarif_achat_cenov_dev_ewan: {
        payload: Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>
        fields: Prisma.tarif_achat_cenov_dev_ewanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.tarif_achat_cenov_dev_ewanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tarif_achat_cenov_dev_ewanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.tarif_achat_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tarif_achat_cenov_dev_ewanPayload>
          }
          findFirst: {
            args: Prisma.tarif_achat_cenov_dev_ewanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tarif_achat_cenov_dev_ewanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.tarif_achat_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tarif_achat_cenov_dev_ewanPayload>
          }
          findMany: {
            args: Prisma.tarif_achat_cenov_dev_ewanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tarif_achat_cenov_dev_ewanPayload>[]
          }
          create: {
            args: Prisma.tarif_achat_cenov_dev_ewanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tarif_achat_cenov_dev_ewanPayload>
          }
          createMany: {
            args: Prisma.tarif_achat_cenov_dev_ewanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.tarif_achat_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tarif_achat_cenov_dev_ewanPayload>[]
          }
          delete: {
            args: Prisma.tarif_achat_cenov_dev_ewanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tarif_achat_cenov_dev_ewanPayload>
          }
          update: {
            args: Prisma.tarif_achat_cenov_dev_ewanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tarif_achat_cenov_dev_ewanPayload>
          }
          deleteMany: {
            args: Prisma.tarif_achat_cenov_dev_ewanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.tarif_achat_cenov_dev_ewanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.tarif_achat_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tarif_achat_cenov_dev_ewanPayload>[]
          }
          upsert: {
            args: Prisma.tarif_achat_cenov_dev_ewanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$tarif_achat_cenov_dev_ewanPayload>
          }
          aggregate: {
            args: Prisma.Tarif_achat_cenov_dev_ewanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTarif_achat_cenov_dev_ewan>
          }
          groupBy: {
            args: Prisma.tarif_achat_cenov_dev_ewanGroupByArgs<ExtArgs>
            result: $Utils.Optional<Tarif_achat_cenov_dev_ewanGroupByOutputType>[]
          }
          count: {
            args: Prisma.tarif_achat_cenov_dev_ewanCountArgs<ExtArgs>
            result: $Utils.Optional<Tarif_achat_cenov_dev_ewanCountAggregateOutputType> | number
          }
        }
      }
      attribut_cenov_dev_ewan: {
        payload: Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>
        fields: Prisma.attribut_cenov_dev_ewanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.attribut_cenov_dev_ewanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribut_cenov_dev_ewanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.attribut_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribut_cenov_dev_ewanPayload>
          }
          findFirst: {
            args: Prisma.attribut_cenov_dev_ewanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribut_cenov_dev_ewanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.attribut_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribut_cenov_dev_ewanPayload>
          }
          findMany: {
            args: Prisma.attribut_cenov_dev_ewanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribut_cenov_dev_ewanPayload>[]
          }
          create: {
            args: Prisma.attribut_cenov_dev_ewanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribut_cenov_dev_ewanPayload>
          }
          createMany: {
            args: Prisma.attribut_cenov_dev_ewanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.attribut_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribut_cenov_dev_ewanPayload>[]
          }
          delete: {
            args: Prisma.attribut_cenov_dev_ewanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribut_cenov_dev_ewanPayload>
          }
          update: {
            args: Prisma.attribut_cenov_dev_ewanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribut_cenov_dev_ewanPayload>
          }
          deleteMany: {
            args: Prisma.attribut_cenov_dev_ewanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.attribut_cenov_dev_ewanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.attribut_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribut_cenov_dev_ewanPayload>[]
          }
          upsert: {
            args: Prisma.attribut_cenov_dev_ewanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$attribut_cenov_dev_ewanPayload>
          }
          aggregate: {
            args: Prisma.Attribut_cenov_dev_ewanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAttribut_cenov_dev_ewan>
          }
          groupBy: {
            args: Prisma.attribut_cenov_dev_ewanGroupByArgs<ExtArgs>
            result: $Utils.Optional<Attribut_cenov_dev_ewanGroupByOutputType>[]
          }
          count: {
            args: Prisma.attribut_cenov_dev_ewanCountArgs<ExtArgs>
            result: $Utils.Optional<Attribut_cenov_dev_ewanCountAggregateOutputType> | number
          }
        }
      }
      fournisseur: {
        payload: Prisma.$fournisseurPayload<ExtArgs>
        fields: Prisma.fournisseurFieldRefs
        operations: {
          findUnique: {
            args: Prisma.fournisseurFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fournisseurPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.fournisseurFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fournisseurPayload>
          }
          findFirst: {
            args: Prisma.fournisseurFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fournisseurPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.fournisseurFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fournisseurPayload>
          }
          findMany: {
            args: Prisma.fournisseurFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fournisseurPayload>[]
          }
          create: {
            args: Prisma.fournisseurCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fournisseurPayload>
          }
          createMany: {
            args: Prisma.fournisseurCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.fournisseurCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fournisseurPayload>[]
          }
          delete: {
            args: Prisma.fournisseurDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fournisseurPayload>
          }
          update: {
            args: Prisma.fournisseurUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fournisseurPayload>
          }
          deleteMany: {
            args: Prisma.fournisseurDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.fournisseurUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.fournisseurUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fournisseurPayload>[]
          }
          upsert: {
            args: Prisma.fournisseurUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$fournisseurPayload>
          }
          aggregate: {
            args: Prisma.FournisseurAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFournisseur>
          }
          groupBy: {
            args: Prisma.fournisseurGroupByArgs<ExtArgs>
            result: $Utils.Optional<FournisseurGroupByOutputType>[]
          }
          count: {
            args: Prisma.fournisseurCountArgs<ExtArgs>
            result: $Utils.Optional<FournisseurCountAggregateOutputType> | number
          }
        }
      }
      kit_cenov_dev_ewan: {
        payload: Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>
        fields: Prisma.kit_cenov_dev_ewanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.kit_cenov_dev_ewanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_cenov_dev_ewanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.kit_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_cenov_dev_ewanPayload>
          }
          findFirst: {
            args: Prisma.kit_cenov_dev_ewanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_cenov_dev_ewanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.kit_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_cenov_dev_ewanPayload>
          }
          findMany: {
            args: Prisma.kit_cenov_dev_ewanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_cenov_dev_ewanPayload>[]
          }
          create: {
            args: Prisma.kit_cenov_dev_ewanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_cenov_dev_ewanPayload>
          }
          createMany: {
            args: Prisma.kit_cenov_dev_ewanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.kit_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_cenov_dev_ewanPayload>[]
          }
          delete: {
            args: Prisma.kit_cenov_dev_ewanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_cenov_dev_ewanPayload>
          }
          update: {
            args: Prisma.kit_cenov_dev_ewanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_cenov_dev_ewanPayload>
          }
          deleteMany: {
            args: Prisma.kit_cenov_dev_ewanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.kit_cenov_dev_ewanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.kit_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_cenov_dev_ewanPayload>[]
          }
          upsert: {
            args: Prisma.kit_cenov_dev_ewanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_cenov_dev_ewanPayload>
          }
          aggregate: {
            args: Prisma.Kit_cenov_dev_ewanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKit_cenov_dev_ewan>
          }
          groupBy: {
            args: Prisma.kit_cenov_dev_ewanGroupByArgs<ExtArgs>
            result: $Utils.Optional<Kit_cenov_dev_ewanGroupByOutputType>[]
          }
          count: {
            args: Prisma.kit_cenov_dev_ewanCountArgs<ExtArgs>
            result: $Utils.Optional<Kit_cenov_dev_ewanCountAggregateOutputType> | number
          }
        }
      }
      kit_attribute_cenov_dev_ewan: {
        payload: Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>
        fields: Prisma.kit_attribute_cenov_dev_ewanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.kit_attribute_cenov_dev_ewanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_attribute_cenov_dev_ewanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.kit_attribute_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_attribute_cenov_dev_ewanPayload>
          }
          findFirst: {
            args: Prisma.kit_attribute_cenov_dev_ewanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_attribute_cenov_dev_ewanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.kit_attribute_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_attribute_cenov_dev_ewanPayload>
          }
          findMany: {
            args: Prisma.kit_attribute_cenov_dev_ewanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_attribute_cenov_dev_ewanPayload>[]
          }
          create: {
            args: Prisma.kit_attribute_cenov_dev_ewanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_attribute_cenov_dev_ewanPayload>
          }
          createMany: {
            args: Prisma.kit_attribute_cenov_dev_ewanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.kit_attribute_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_attribute_cenov_dev_ewanPayload>[]
          }
          delete: {
            args: Prisma.kit_attribute_cenov_dev_ewanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_attribute_cenov_dev_ewanPayload>
          }
          update: {
            args: Prisma.kit_attribute_cenov_dev_ewanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_attribute_cenov_dev_ewanPayload>
          }
          deleteMany: {
            args: Prisma.kit_attribute_cenov_dev_ewanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.kit_attribute_cenov_dev_ewanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.kit_attribute_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_attribute_cenov_dev_ewanPayload>[]
          }
          upsert: {
            args: Prisma.kit_attribute_cenov_dev_ewanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$kit_attribute_cenov_dev_ewanPayload>
          }
          aggregate: {
            args: Prisma.Kit_attribute_cenov_dev_ewanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKit_attribute_cenov_dev_ewan>
          }
          groupBy: {
            args: Prisma.kit_attribute_cenov_dev_ewanGroupByArgs<ExtArgs>
            result: $Utils.Optional<Kit_attribute_cenov_dev_ewanGroupByOutputType>[]
          }
          count: {
            args: Prisma.kit_attribute_cenov_dev_ewanCountArgs<ExtArgs>
            result: $Utils.Optional<Kit_attribute_cenov_dev_ewanCountAggregateOutputType> | number
          }
        }
      }
      part_nc_cenov_dev_ewan: {
        payload: Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>
        fields: Prisma.part_nc_cenov_dev_ewanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.part_nc_cenov_dev_ewanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$part_nc_cenov_dev_ewanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.part_nc_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$part_nc_cenov_dev_ewanPayload>
          }
          findFirst: {
            args: Prisma.part_nc_cenov_dev_ewanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$part_nc_cenov_dev_ewanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.part_nc_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$part_nc_cenov_dev_ewanPayload>
          }
          findMany: {
            args: Prisma.part_nc_cenov_dev_ewanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$part_nc_cenov_dev_ewanPayload>[]
          }
          create: {
            args: Prisma.part_nc_cenov_dev_ewanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$part_nc_cenov_dev_ewanPayload>
          }
          createMany: {
            args: Prisma.part_nc_cenov_dev_ewanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.part_nc_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$part_nc_cenov_dev_ewanPayload>[]
          }
          delete: {
            args: Prisma.part_nc_cenov_dev_ewanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$part_nc_cenov_dev_ewanPayload>
          }
          update: {
            args: Prisma.part_nc_cenov_dev_ewanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$part_nc_cenov_dev_ewanPayload>
          }
          deleteMany: {
            args: Prisma.part_nc_cenov_dev_ewanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.part_nc_cenov_dev_ewanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.part_nc_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$part_nc_cenov_dev_ewanPayload>[]
          }
          upsert: {
            args: Prisma.part_nc_cenov_dev_ewanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$part_nc_cenov_dev_ewanPayload>
          }
          aggregate: {
            args: Prisma.Part_nc_cenov_dev_ewanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePart_nc_cenov_dev_ewan>
          }
          groupBy: {
            args: Prisma.part_nc_cenov_dev_ewanGroupByArgs<ExtArgs>
            result: $Utils.Optional<Part_nc_cenov_dev_ewanGroupByOutputType>[]
          }
          count: {
            args: Prisma.part_nc_cenov_dev_ewanCountArgs<ExtArgs>
            result: $Utils.Optional<Part_nc_cenov_dev_ewanCountAggregateOutputType> | number
          }
        }
      }
      famille_ewan: {
        payload: Prisma.$famille_ewanPayload<ExtArgs>
        fields: Prisma.famille_ewanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.famille_ewanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famille_ewanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.famille_ewanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famille_ewanPayload>
          }
          findFirst: {
            args: Prisma.famille_ewanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famille_ewanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.famille_ewanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famille_ewanPayload>
          }
          findMany: {
            args: Prisma.famille_ewanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famille_ewanPayload>[]
          }
          create: {
            args: Prisma.famille_ewanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famille_ewanPayload>
          }
          createMany: {
            args: Prisma.famille_ewanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.famille_ewanCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famille_ewanPayload>[]
          }
          delete: {
            args: Prisma.famille_ewanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famille_ewanPayload>
          }
          update: {
            args: Prisma.famille_ewanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famille_ewanPayload>
          }
          deleteMany: {
            args: Prisma.famille_ewanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.famille_ewanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.famille_ewanUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famille_ewanPayload>[]
          }
          upsert: {
            args: Prisma.famille_ewanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$famille_ewanPayload>
          }
          aggregate: {
            args: Prisma.Famille_ewanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFamille_ewan>
          }
          groupBy: {
            args: Prisma.famille_ewanGroupByArgs<ExtArgs>
            result: $Utils.Optional<Famille_ewanGroupByOutputType>[]
          }
          count: {
            args: Prisma.famille_ewanCountArgs<ExtArgs>
            result: $Utils.Optional<Famille_ewanCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    categorie?: categorieOmit
    categorie_attribut_cenov_dev_ewan?: categorie_attribut_cenov_dev_ewanOmit
    cross_ref?: cross_refOmit
    famille?: familleOmit
    produit?: produitOmit
    produit_categorie_cenov_dev_ewan?: produit_categorie_cenov_dev_ewanOmit
    tarif_achat_cenov_dev_ewan?: tarif_achat_cenov_dev_ewanOmit
    attribut_cenov_dev_ewan?: attribut_cenov_dev_ewanOmit
    fournisseur?: fournisseurOmit
    kit_cenov_dev_ewan?: kit_cenov_dev_ewanOmit
    kit_attribute_cenov_dev_ewan?: kit_attribute_cenov_dev_ewanOmit
    part_nc_cenov_dev_ewan?: part_nc_cenov_dev_ewanOmit
    famille_ewan?: famille_ewanOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CategorieCountOutputType
   */

  export type CategorieCountOutputType = {
    other_categorie: number
    categorie_attribut: number
    produit_categorie: number
  }

  export type CategorieCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    other_categorie?: boolean | CategorieCountOutputTypeCountOther_categorieArgs
    categorie_attribut?: boolean | CategorieCountOutputTypeCountCategorie_attributArgs
    produit_categorie?: boolean | CategorieCountOutputTypeCountProduit_categorieArgs
  }

  // Custom InputTypes
  /**
   * CategorieCountOutputType without action
   */
  export type CategorieCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategorieCountOutputType
     */
    select?: CategorieCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategorieCountOutputType without action
   */
  export type CategorieCountOutputTypeCountOther_categorieArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: categorieWhereInput
  }

  /**
   * CategorieCountOutputType without action
   */
  export type CategorieCountOutputTypeCountCategorie_attributArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: categorie_attribut_cenov_dev_ewanWhereInput
  }

  /**
   * CategorieCountOutputType without action
   */
  export type CategorieCountOutputTypeCountProduit_categorieArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: produit_categorie_cenov_dev_ewanWhereInput
  }


  /**
   * Count Type FamilleCountOutputType
   */

  export type FamilleCountOutputType = {
    other_famille: number
  }

  export type FamilleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    other_famille?: boolean | FamilleCountOutputTypeCountOther_familleArgs
  }

  // Custom InputTypes
  /**
   * FamilleCountOutputType without action
   */
  export type FamilleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FamilleCountOutputType
     */
    select?: FamilleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FamilleCountOutputType without action
   */
  export type FamilleCountOutputTypeCountOther_familleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: familleWhereInput
  }


  /**
   * Count Type ProduitCountOutputType
   */

  export type ProduitCountOutputType = {
    cross_ref: number
    produit_categorie: number
    tarif_achat: number
  }

  export type ProduitCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cross_ref?: boolean | ProduitCountOutputTypeCountCross_refArgs
    produit_categorie?: boolean | ProduitCountOutputTypeCountProduit_categorieArgs
    tarif_achat?: boolean | ProduitCountOutputTypeCountTarif_achatArgs
  }

  // Custom InputTypes
  /**
   * ProduitCountOutputType without action
   */
  export type ProduitCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProduitCountOutputType
     */
    select?: ProduitCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProduitCountOutputType without action
   */
  export type ProduitCountOutputTypeCountCross_refArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: cross_refWhereInput
  }

  /**
   * ProduitCountOutputType without action
   */
  export type ProduitCountOutputTypeCountProduit_categorieArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: produit_categorie_cenov_dev_ewanWhereInput
  }

  /**
   * ProduitCountOutputType without action
   */
  export type ProduitCountOutputTypeCountTarif_achatArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tarif_achat_cenov_dev_ewanWhereInput
  }


  /**
   * Count Type Attribut_cenov_dev_ewanCountOutputType
   */

  export type Attribut_cenov_dev_ewanCountOutputType = {
    categorie_attribut: number
    kit_attribute_kit_attribute_fk_attribute_caracToattribut: number
    kit_attribute_kit_attribute_fk_attribute_unitToattribut: number
  }

  export type Attribut_cenov_dev_ewanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categorie_attribut?: boolean | Attribut_cenov_dev_ewanCountOutputTypeCountCategorie_attributArgs
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: boolean | Attribut_cenov_dev_ewanCountOutputTypeCountKit_attribute_kit_attribute_fk_attribute_caracToattributArgs
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: boolean | Attribut_cenov_dev_ewanCountOutputTypeCountKit_attribute_kit_attribute_fk_attribute_unitToattributArgs
  }

  // Custom InputTypes
  /**
   * Attribut_cenov_dev_ewanCountOutputType without action
   */
  export type Attribut_cenov_dev_ewanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Attribut_cenov_dev_ewanCountOutputType
     */
    select?: Attribut_cenov_dev_ewanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Attribut_cenov_dev_ewanCountOutputType without action
   */
  export type Attribut_cenov_dev_ewanCountOutputTypeCountCategorie_attributArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: categorie_attribut_cenov_dev_ewanWhereInput
  }

  /**
   * Attribut_cenov_dev_ewanCountOutputType without action
   */
  export type Attribut_cenov_dev_ewanCountOutputTypeCountKit_attribute_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: kit_attribute_cenov_dev_ewanWhereInput
  }

  /**
   * Attribut_cenov_dev_ewanCountOutputType without action
   */
  export type Attribut_cenov_dev_ewanCountOutputTypeCountKit_attribute_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: kit_attribute_cenov_dev_ewanWhereInput
  }


  /**
   * Count Type FournisseurCountOutputType
   */

  export type FournisseurCountOutputType = {
    famille: number
    produit: number
  }

  export type FournisseurCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    famille?: boolean | FournisseurCountOutputTypeCountFamilleArgs
    produit?: boolean | FournisseurCountOutputTypeCountProduitArgs
  }

  // Custom InputTypes
  /**
   * FournisseurCountOutputType without action
   */
  export type FournisseurCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FournisseurCountOutputType
     */
    select?: FournisseurCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FournisseurCountOutputType without action
   */
  export type FournisseurCountOutputTypeCountFamilleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: familleWhereInput
  }

  /**
   * FournisseurCountOutputType without action
   */
  export type FournisseurCountOutputTypeCountProduitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: produitWhereInput
  }


  /**
   * Count Type Kit_cenov_dev_ewanCountOutputType
   */

  export type Kit_cenov_dev_ewanCountOutputType = {
    produit: number
    kit_attribute: number
    part_nc: number
  }

  export type Kit_cenov_dev_ewanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produit?: boolean | Kit_cenov_dev_ewanCountOutputTypeCountProduitArgs
    kit_attribute?: boolean | Kit_cenov_dev_ewanCountOutputTypeCountKit_attributeArgs
    part_nc?: boolean | Kit_cenov_dev_ewanCountOutputTypeCountPart_ncArgs
  }

  // Custom InputTypes
  /**
   * Kit_cenov_dev_ewanCountOutputType without action
   */
  export type Kit_cenov_dev_ewanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kit_cenov_dev_ewanCountOutputType
     */
    select?: Kit_cenov_dev_ewanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * Kit_cenov_dev_ewanCountOutputType without action
   */
  export type Kit_cenov_dev_ewanCountOutputTypeCountProduitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: produitWhereInput
  }

  /**
   * Kit_cenov_dev_ewanCountOutputType without action
   */
  export type Kit_cenov_dev_ewanCountOutputTypeCountKit_attributeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: kit_attribute_cenov_dev_ewanWhereInput
  }

  /**
   * Kit_cenov_dev_ewanCountOutputType without action
   */
  export type Kit_cenov_dev_ewanCountOutputTypeCountPart_ncArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: part_nc_cenov_dev_ewanWhereInput
  }


  /**
   * Models
   */

  /**
   * Model categorie
   */

  export type AggregateCategorie = {
    _count: CategorieCountAggregateOutputType | null
    _avg: CategorieAvgAggregateOutputType | null
    _sum: CategorieSumAggregateOutputType | null
    _min: CategorieMinAggregateOutputType | null
    _max: CategorieMaxAggregateOutputType | null
  }

  export type CategorieAvgAggregateOutputType = {
    cat_id: number | null
    fk_parent: number | null
  }

  export type CategorieSumAggregateOutputType = {
    cat_id: number | null
    fk_parent: number | null
  }

  export type CategorieMinAggregateOutputType = {
    cat_id: number | null
    fk_parent: number | null
    cat_code: string | null
    cat_label: string | null
  }

  export type CategorieMaxAggregateOutputType = {
    cat_id: number | null
    fk_parent: number | null
    cat_code: string | null
    cat_label: string | null
  }

  export type CategorieCountAggregateOutputType = {
    cat_id: number
    fk_parent: number
    cat_code: number
    cat_label: number
    _all: number
  }


  export type CategorieAvgAggregateInputType = {
    cat_id?: true
    fk_parent?: true
  }

  export type CategorieSumAggregateInputType = {
    cat_id?: true
    fk_parent?: true
  }

  export type CategorieMinAggregateInputType = {
    cat_id?: true
    fk_parent?: true
    cat_code?: true
    cat_label?: true
  }

  export type CategorieMaxAggregateInputType = {
    cat_id?: true
    fk_parent?: true
    cat_code?: true
    cat_label?: true
  }

  export type CategorieCountAggregateInputType = {
    cat_id?: true
    fk_parent?: true
    cat_code?: true
    cat_label?: true
    _all?: true
  }

  export type CategorieAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which categorie to aggregate.
     */
    where?: categorieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categorieOrderByWithRelationInput | categorieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: categorieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned categories
    **/
    _count?: true | CategorieCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CategorieAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CategorieSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategorieMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategorieMaxAggregateInputType
  }

  export type GetCategorieAggregateType<T extends CategorieAggregateArgs> = {
        [P in keyof T & keyof AggregateCategorie]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategorie[P]>
      : GetScalarType<T[P], AggregateCategorie[P]>
  }




  export type categorieGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: categorieWhereInput
    orderBy?: categorieOrderByWithAggregationInput | categorieOrderByWithAggregationInput[]
    by: CategorieScalarFieldEnum[] | CategorieScalarFieldEnum
    having?: categorieScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategorieCountAggregateInputType | true
    _avg?: CategorieAvgAggregateInputType
    _sum?: CategorieSumAggregateInputType
    _min?: CategorieMinAggregateInputType
    _max?: CategorieMaxAggregateInputType
  }

  export type CategorieGroupByOutputType = {
    cat_id: number
    fk_parent: number | null
    cat_code: string | null
    cat_label: string | null
    _count: CategorieCountAggregateOutputType | null
    _avg: CategorieAvgAggregateOutputType | null
    _sum: CategorieSumAggregateOutputType | null
    _min: CategorieMinAggregateOutputType | null
    _max: CategorieMaxAggregateOutputType | null
  }

  type GetCategorieGroupByPayload<T extends categorieGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategorieGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategorieGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategorieGroupByOutputType[P]>
            : GetScalarType<T[P], CategorieGroupByOutputType[P]>
        }
      >
    >


  export type categorieSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    cat_id?: boolean
    fk_parent?: boolean
    cat_code?: boolean
    cat_label?: boolean
    categorie?: boolean | categorie$categorieArgs<ExtArgs>
    other_categorie?: boolean | categorie$other_categorieArgs<ExtArgs>
    categorie_attribut?: boolean | categorie$categorie_attributArgs<ExtArgs>
    produit_categorie?: boolean | categorie$produit_categorieArgs<ExtArgs>
    _count?: boolean | CategorieCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categorie"]>

  export type categorieSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    cat_id?: boolean
    fk_parent?: boolean
    cat_code?: boolean
    cat_label?: boolean
    categorie?: boolean | categorie$categorieArgs<ExtArgs>
  }, ExtArgs["result"]["categorie"]>

  export type categorieSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    cat_id?: boolean
    fk_parent?: boolean
    cat_code?: boolean
    cat_label?: boolean
    categorie?: boolean | categorie$categorieArgs<ExtArgs>
  }, ExtArgs["result"]["categorie"]>

  export type categorieSelectScalar = {
    cat_id?: boolean
    fk_parent?: boolean
    cat_code?: boolean
    cat_label?: boolean
  }

  export type categorieOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"cat_id" | "fk_parent" | "cat_code" | "cat_label", ExtArgs["result"]["categorie"]>
  export type categorieInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categorie?: boolean | categorie$categorieArgs<ExtArgs>
    other_categorie?: boolean | categorie$other_categorieArgs<ExtArgs>
    categorie_attribut?: boolean | categorie$categorie_attributArgs<ExtArgs>
    produit_categorie?: boolean | categorie$produit_categorieArgs<ExtArgs>
    _count?: boolean | CategorieCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type categorieIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categorie?: boolean | categorie$categorieArgs<ExtArgs>
  }
  export type categorieIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categorie?: boolean | categorie$categorieArgs<ExtArgs>
  }

  export type $categoriePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "categorie"
    objects: {
      categorie: Prisma.$categoriePayload<ExtArgs> | null
      other_categorie: Prisma.$categoriePayload<ExtArgs>[]
      categorie_attribut: Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>[]
      produit_categorie: Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      cat_id: number
      fk_parent: number | null
      cat_code: string | null
      cat_label: string | null
    }, ExtArgs["result"]["categorie"]>
    composites: {}
  }

  type categorieGetPayload<S extends boolean | null | undefined | categorieDefaultArgs> = $Result.GetResult<Prisma.$categoriePayload, S>

  type categorieCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<categorieFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CategorieCountAggregateInputType | true
    }

  export interface categorieDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['categorie'], meta: { name: 'categorie' } }
    /**
     * Find zero or one Categorie that matches the filter.
     * @param {categorieFindUniqueArgs} args - Arguments to find a Categorie
     * @example
     * // Get one Categorie
     * const categorie = await prisma.categorie.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends categorieFindUniqueArgs>(args: SelectSubset<T, categorieFindUniqueArgs<ExtArgs>>): Prisma__categorieClient<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Categorie that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {categorieFindUniqueOrThrowArgs} args - Arguments to find a Categorie
     * @example
     * // Get one Categorie
     * const categorie = await prisma.categorie.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends categorieFindUniqueOrThrowArgs>(args: SelectSubset<T, categorieFindUniqueOrThrowArgs<ExtArgs>>): Prisma__categorieClient<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Categorie that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categorieFindFirstArgs} args - Arguments to find a Categorie
     * @example
     * // Get one Categorie
     * const categorie = await prisma.categorie.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends categorieFindFirstArgs>(args?: SelectSubset<T, categorieFindFirstArgs<ExtArgs>>): Prisma__categorieClient<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Categorie that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categorieFindFirstOrThrowArgs} args - Arguments to find a Categorie
     * @example
     * // Get one Categorie
     * const categorie = await prisma.categorie.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends categorieFindFirstOrThrowArgs>(args?: SelectSubset<T, categorieFindFirstOrThrowArgs<ExtArgs>>): Prisma__categorieClient<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categorieFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.categorie.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.categorie.findMany({ take: 10 })
     * 
     * // Only select the `cat_id`
     * const categorieWithCat_idOnly = await prisma.categorie.findMany({ select: { cat_id: true } })
     * 
     */
    findMany<T extends categorieFindManyArgs>(args?: SelectSubset<T, categorieFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Categorie.
     * @param {categorieCreateArgs} args - Arguments to create a Categorie.
     * @example
     * // Create one Categorie
     * const Categorie = await prisma.categorie.create({
     *   data: {
     *     // ... data to create a Categorie
     *   }
     * })
     * 
     */
    create<T extends categorieCreateArgs>(args: SelectSubset<T, categorieCreateArgs<ExtArgs>>): Prisma__categorieClient<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categories.
     * @param {categorieCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const categorie = await prisma.categorie.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends categorieCreateManyArgs>(args?: SelectSubset<T, categorieCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {categorieCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const categorie = await prisma.categorie.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `cat_id`
     * const categorieWithCat_idOnly = await prisma.categorie.createManyAndReturn({
     *   select: { cat_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends categorieCreateManyAndReturnArgs>(args?: SelectSubset<T, categorieCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Categorie.
     * @param {categorieDeleteArgs} args - Arguments to delete one Categorie.
     * @example
     * // Delete one Categorie
     * const Categorie = await prisma.categorie.delete({
     *   where: {
     *     // ... filter to delete one Categorie
     *   }
     * })
     * 
     */
    delete<T extends categorieDeleteArgs>(args: SelectSubset<T, categorieDeleteArgs<ExtArgs>>): Prisma__categorieClient<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Categorie.
     * @param {categorieUpdateArgs} args - Arguments to update one Categorie.
     * @example
     * // Update one Categorie
     * const categorie = await prisma.categorie.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends categorieUpdateArgs>(args: SelectSubset<T, categorieUpdateArgs<ExtArgs>>): Prisma__categorieClient<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categories.
     * @param {categorieDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.categorie.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends categorieDeleteManyArgs>(args?: SelectSubset<T, categorieDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categorieUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const categorie = await prisma.categorie.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends categorieUpdateManyArgs>(args: SelectSubset<T, categorieUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories and returns the data updated in the database.
     * @param {categorieUpdateManyAndReturnArgs} args - Arguments to update many Categories.
     * @example
     * // Update many Categories
     * const categorie = await prisma.categorie.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Categories and only return the `cat_id`
     * const categorieWithCat_idOnly = await prisma.categorie.updateManyAndReturn({
     *   select: { cat_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends categorieUpdateManyAndReturnArgs>(args: SelectSubset<T, categorieUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Categorie.
     * @param {categorieUpsertArgs} args - Arguments to update or create a Categorie.
     * @example
     * // Update or create a Categorie
     * const categorie = await prisma.categorie.upsert({
     *   create: {
     *     // ... data to create a Categorie
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Categorie we want to update
     *   }
     * })
     */
    upsert<T extends categorieUpsertArgs>(args: SelectSubset<T, categorieUpsertArgs<ExtArgs>>): Prisma__categorieClient<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categorieCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.categorie.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends categorieCountArgs>(
      args?: Subset<T, categorieCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategorieCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Categorie.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategorieAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategorieAggregateArgs>(args: Subset<T, CategorieAggregateArgs>): Prisma.PrismaPromise<GetCategorieAggregateType<T>>

    /**
     * Group by Categorie.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categorieGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends categorieGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: categorieGroupByArgs['orderBy'] }
        : { orderBy?: categorieGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, categorieGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategorieGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the categorie model
   */
  readonly fields: categorieFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for categorie.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__categorieClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    categorie<T extends categorie$categorieArgs<ExtArgs> = {}>(args?: Subset<T, categorie$categorieArgs<ExtArgs>>): Prisma__categorieClient<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    other_categorie<T extends categorie$other_categorieArgs<ExtArgs> = {}>(args?: Subset<T, categorie$other_categorieArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    categorie_attribut<T extends categorie$categorie_attributArgs<ExtArgs> = {}>(args?: Subset<T, categorie$categorie_attributArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    produit_categorie<T extends categorie$produit_categorieArgs<ExtArgs> = {}>(args?: Subset<T, categorie$produit_categorieArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the categorie model
   */
  interface categorieFieldRefs {
    readonly cat_id: FieldRef<"categorie", 'Int'>
    readonly fk_parent: FieldRef<"categorie", 'Int'>
    readonly cat_code: FieldRef<"categorie", 'String'>
    readonly cat_label: FieldRef<"categorie", 'String'>
  }
    

  // Custom InputTypes
  /**
   * categorie findUnique
   */
  export type categorieFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieInclude<ExtArgs> | null
    /**
     * Filter, which categorie to fetch.
     */
    where: categorieWhereUniqueInput
  }

  /**
   * categorie findUniqueOrThrow
   */
  export type categorieFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieInclude<ExtArgs> | null
    /**
     * Filter, which categorie to fetch.
     */
    where: categorieWhereUniqueInput
  }

  /**
   * categorie findFirst
   */
  export type categorieFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieInclude<ExtArgs> | null
    /**
     * Filter, which categorie to fetch.
     */
    where?: categorieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categorieOrderByWithRelationInput | categorieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for categories.
     */
    cursor?: categorieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of categories.
     */
    distinct?: CategorieScalarFieldEnum | CategorieScalarFieldEnum[]
  }

  /**
   * categorie findFirstOrThrow
   */
  export type categorieFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieInclude<ExtArgs> | null
    /**
     * Filter, which categorie to fetch.
     */
    where?: categorieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categorieOrderByWithRelationInput | categorieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for categories.
     */
    cursor?: categorieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of categories.
     */
    distinct?: CategorieScalarFieldEnum | CategorieScalarFieldEnum[]
  }

  /**
   * categorie findMany
   */
  export type categorieFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieInclude<ExtArgs> | null
    /**
     * Filter, which categories to fetch.
     */
    where?: categorieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categories to fetch.
     */
    orderBy?: categorieOrderByWithRelationInput | categorieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing categories.
     */
    cursor?: categorieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categories.
     */
    skip?: number
    distinct?: CategorieScalarFieldEnum | CategorieScalarFieldEnum[]
  }

  /**
   * categorie create
   */
  export type categorieCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieInclude<ExtArgs> | null
    /**
     * The data needed to create a categorie.
     */
    data?: XOR<categorieCreateInput, categorieUncheckedCreateInput>
  }

  /**
   * categorie createMany
   */
  export type categorieCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many categories.
     */
    data: categorieCreateManyInput | categorieCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * categorie createManyAndReturn
   */
  export type categorieCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * The data used to create many categories.
     */
    data: categorieCreateManyInput | categorieCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * categorie update
   */
  export type categorieUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieInclude<ExtArgs> | null
    /**
     * The data needed to update a categorie.
     */
    data: XOR<categorieUpdateInput, categorieUncheckedUpdateInput>
    /**
     * Choose, which categorie to update.
     */
    where: categorieWhereUniqueInput
  }

  /**
   * categorie updateMany
   */
  export type categorieUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update categories.
     */
    data: XOR<categorieUpdateManyMutationInput, categorieUncheckedUpdateManyInput>
    /**
     * Filter which categories to update
     */
    where?: categorieWhereInput
    /**
     * Limit how many categories to update.
     */
    limit?: number
  }

  /**
   * categorie updateManyAndReturn
   */
  export type categorieUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * The data used to update categories.
     */
    data: XOR<categorieUpdateManyMutationInput, categorieUncheckedUpdateManyInput>
    /**
     * Filter which categories to update
     */
    where?: categorieWhereInput
    /**
     * Limit how many categories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * categorie upsert
   */
  export type categorieUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieInclude<ExtArgs> | null
    /**
     * The filter to search for the categorie to update in case it exists.
     */
    where: categorieWhereUniqueInput
    /**
     * In case the categorie found by the `where` argument doesn't exist, create a new categorie with this data.
     */
    create: XOR<categorieCreateInput, categorieUncheckedCreateInput>
    /**
     * In case the categorie was found with the provided `where` argument, update it with this data.
     */
    update: XOR<categorieUpdateInput, categorieUncheckedUpdateInput>
  }

  /**
   * categorie delete
   */
  export type categorieDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieInclude<ExtArgs> | null
    /**
     * Filter which categorie to delete.
     */
    where: categorieWhereUniqueInput
  }

  /**
   * categorie deleteMany
   */
  export type categorieDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which categories to delete
     */
    where?: categorieWhereInput
    /**
     * Limit how many categories to delete.
     */
    limit?: number
  }

  /**
   * categorie.categorie
   */
  export type categorie$categorieArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieInclude<ExtArgs> | null
    where?: categorieWhereInput
  }

  /**
   * categorie.other_categorie
   */
  export type categorie$other_categorieArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieInclude<ExtArgs> | null
    where?: categorieWhereInput
    orderBy?: categorieOrderByWithRelationInput | categorieOrderByWithRelationInput[]
    cursor?: categorieWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CategorieScalarFieldEnum | CategorieScalarFieldEnum[]
  }

  /**
   * categorie.categorie_attribut
   */
  export type categorie$categorie_attributArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanInclude<ExtArgs> | null
    where?: categorie_attribut_cenov_dev_ewanWhereInput
    orderBy?: categorie_attribut_cenov_dev_ewanOrderByWithRelationInput | categorie_attribut_cenov_dev_ewanOrderByWithRelationInput[]
    cursor?: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Categorie_attribut_cenov_dev_ewanScalarFieldEnum | Categorie_attribut_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * categorie.produit_categorie
   */
  export type categorie$produit_categorieArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanInclude<ExtArgs> | null
    where?: produit_categorie_cenov_dev_ewanWhereInput
    orderBy?: produit_categorie_cenov_dev_ewanOrderByWithRelationInput | produit_categorie_cenov_dev_ewanOrderByWithRelationInput[]
    cursor?: produit_categorie_cenov_dev_ewanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Produit_categorie_cenov_dev_ewanScalarFieldEnum | Produit_categorie_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * categorie without action
   */
  export type categorieDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie
     */
    select?: categorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie
     */
    omit?: categorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorieInclude<ExtArgs> | null
  }


  /**
   * Model categorie_attribut_cenov_dev_ewan
   */

  export type AggregateCategorie_attribut_cenov_dev_ewan = {
    _count: Categorie_attribut_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Categorie_attribut_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Categorie_attribut_cenov_dev_ewanSumAggregateOutputType | null
    _min: Categorie_attribut_cenov_dev_ewanMinAggregateOutputType | null
    _max: Categorie_attribut_cenov_dev_ewanMaxAggregateOutputType | null
  }

  export type Categorie_attribut_cenov_dev_ewanAvgAggregateOutputType = {
    fk_categorie: number | null
    fk_attribute: number | null
  }

  export type Categorie_attribut_cenov_dev_ewanSumAggregateOutputType = {
    fk_categorie: number | null
    fk_attribute: number | null
  }

  export type Categorie_attribut_cenov_dev_ewanMinAggregateOutputType = {
    fk_categorie: number | null
    fk_attribute: number | null
  }

  export type Categorie_attribut_cenov_dev_ewanMaxAggregateOutputType = {
    fk_categorie: number | null
    fk_attribute: number | null
  }

  export type Categorie_attribut_cenov_dev_ewanCountAggregateOutputType = {
    fk_categorie: number
    fk_attribute: number
    _all: number
  }


  export type Categorie_attribut_cenov_dev_ewanAvgAggregateInputType = {
    fk_categorie?: true
    fk_attribute?: true
  }

  export type Categorie_attribut_cenov_dev_ewanSumAggregateInputType = {
    fk_categorie?: true
    fk_attribute?: true
  }

  export type Categorie_attribut_cenov_dev_ewanMinAggregateInputType = {
    fk_categorie?: true
    fk_attribute?: true
  }

  export type Categorie_attribut_cenov_dev_ewanMaxAggregateInputType = {
    fk_categorie?: true
    fk_attribute?: true
  }

  export type Categorie_attribut_cenov_dev_ewanCountAggregateInputType = {
    fk_categorie?: true
    fk_attribute?: true
    _all?: true
  }

  export type Categorie_attribut_cenov_dev_ewanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which categorie_attribut_cenov_dev_ewan to aggregate.
     */
    where?: categorie_attribut_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categorie_attribut_cenov_dev_ewans to fetch.
     */
    orderBy?: categorie_attribut_cenov_dev_ewanOrderByWithRelationInput | categorie_attribut_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categorie_attribut_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categorie_attribut_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned categorie_attribut_cenov_dev_ewans
    **/
    _count?: true | Categorie_attribut_cenov_dev_ewanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Categorie_attribut_cenov_dev_ewanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Categorie_attribut_cenov_dev_ewanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Categorie_attribut_cenov_dev_ewanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Categorie_attribut_cenov_dev_ewanMaxAggregateInputType
  }

  export type GetCategorie_attribut_cenov_dev_ewanAggregateType<T extends Categorie_attribut_cenov_dev_ewanAggregateArgs> = {
        [P in keyof T & keyof AggregateCategorie_attribut_cenov_dev_ewan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategorie_attribut_cenov_dev_ewan[P]>
      : GetScalarType<T[P], AggregateCategorie_attribut_cenov_dev_ewan[P]>
  }




  export type categorie_attribut_cenov_dev_ewanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: categorie_attribut_cenov_dev_ewanWhereInput
    orderBy?: categorie_attribut_cenov_dev_ewanOrderByWithAggregationInput | categorie_attribut_cenov_dev_ewanOrderByWithAggregationInput[]
    by: Categorie_attribut_cenov_dev_ewanScalarFieldEnum[] | Categorie_attribut_cenov_dev_ewanScalarFieldEnum
    having?: categorie_attribut_cenov_dev_ewanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Categorie_attribut_cenov_dev_ewanCountAggregateInputType | true
    _avg?: Categorie_attribut_cenov_dev_ewanAvgAggregateInputType
    _sum?: Categorie_attribut_cenov_dev_ewanSumAggregateInputType
    _min?: Categorie_attribut_cenov_dev_ewanMinAggregateInputType
    _max?: Categorie_attribut_cenov_dev_ewanMaxAggregateInputType
  }

  export type Categorie_attribut_cenov_dev_ewanGroupByOutputType = {
    fk_categorie: number
    fk_attribute: number
    _count: Categorie_attribut_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Categorie_attribut_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Categorie_attribut_cenov_dev_ewanSumAggregateOutputType | null
    _min: Categorie_attribut_cenov_dev_ewanMinAggregateOutputType | null
    _max: Categorie_attribut_cenov_dev_ewanMaxAggregateOutputType | null
  }

  type GetCategorie_attribut_cenov_dev_ewanGroupByPayload<T extends categorie_attribut_cenov_dev_ewanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Categorie_attribut_cenov_dev_ewanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Categorie_attribut_cenov_dev_ewanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Categorie_attribut_cenov_dev_ewanGroupByOutputType[P]>
            : GetScalarType<T[P], Categorie_attribut_cenov_dev_ewanGroupByOutputType[P]>
        }
      >
    >


  export type categorie_attribut_cenov_dev_ewanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fk_categorie?: boolean
    fk_attribute?: boolean
    attribut?: boolean | attribut_cenov_dev_ewanDefaultArgs<ExtArgs>
    categorie?: boolean | categorieDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categorie_attribut_cenov_dev_ewan"]>

  export type categorie_attribut_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fk_categorie?: boolean
    fk_attribute?: boolean
    attribut?: boolean | attribut_cenov_dev_ewanDefaultArgs<ExtArgs>
    categorie?: boolean | categorieDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categorie_attribut_cenov_dev_ewan"]>

  export type categorie_attribut_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fk_categorie?: boolean
    fk_attribute?: boolean
    attribut?: boolean | attribut_cenov_dev_ewanDefaultArgs<ExtArgs>
    categorie?: boolean | categorieDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["categorie_attribut_cenov_dev_ewan"]>

  export type categorie_attribut_cenov_dev_ewanSelectScalar = {
    fk_categorie?: boolean
    fk_attribute?: boolean
  }

  export type categorie_attribut_cenov_dev_ewanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"fk_categorie" | "fk_attribute", ExtArgs["result"]["categorie_attribut_cenov_dev_ewan"]>
  export type categorie_attribut_cenov_dev_ewanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attribut?: boolean | attribut_cenov_dev_ewanDefaultArgs<ExtArgs>
    categorie?: boolean | categorieDefaultArgs<ExtArgs>
  }
  export type categorie_attribut_cenov_dev_ewanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attribut?: boolean | attribut_cenov_dev_ewanDefaultArgs<ExtArgs>
    categorie?: boolean | categorieDefaultArgs<ExtArgs>
  }
  export type categorie_attribut_cenov_dev_ewanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attribut?: boolean | attribut_cenov_dev_ewanDefaultArgs<ExtArgs>
    categorie?: boolean | categorieDefaultArgs<ExtArgs>
  }

  export type $categorie_attribut_cenov_dev_ewanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "categorie_attribut_cenov_dev_ewan"
    objects: {
      attribut: Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>
      categorie: Prisma.$categoriePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      fk_categorie: number
      fk_attribute: number
    }, ExtArgs["result"]["categorie_attribut_cenov_dev_ewan"]>
    composites: {}
  }

  type categorie_attribut_cenov_dev_ewanGetPayload<S extends boolean | null | undefined | categorie_attribut_cenov_dev_ewanDefaultArgs> = $Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload, S>

  type categorie_attribut_cenov_dev_ewanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<categorie_attribut_cenov_dev_ewanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Categorie_attribut_cenov_dev_ewanCountAggregateInputType | true
    }

  export interface categorie_attribut_cenov_dev_ewanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['categorie_attribut_cenov_dev_ewan'], meta: { name: 'categorie_attribut_cenov_dev_ewan' } }
    /**
     * Find zero or one Categorie_attribut_cenov_dev_ewan that matches the filter.
     * @param {categorie_attribut_cenov_dev_ewanFindUniqueArgs} args - Arguments to find a Categorie_attribut_cenov_dev_ewan
     * @example
     * // Get one Categorie_attribut_cenov_dev_ewan
     * const categorie_attribut_cenov_dev_ewan = await prisma.categorie_attribut_cenov_dev_ewan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends categorie_attribut_cenov_dev_ewanFindUniqueArgs>(args: SelectSubset<T, categorie_attribut_cenov_dev_ewanFindUniqueArgs<ExtArgs>>): Prisma__categorie_attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Categorie_attribut_cenov_dev_ewan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {categorie_attribut_cenov_dev_ewanFindUniqueOrThrowArgs} args - Arguments to find a Categorie_attribut_cenov_dev_ewan
     * @example
     * // Get one Categorie_attribut_cenov_dev_ewan
     * const categorie_attribut_cenov_dev_ewan = await prisma.categorie_attribut_cenov_dev_ewan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends categorie_attribut_cenov_dev_ewanFindUniqueOrThrowArgs>(args: SelectSubset<T, categorie_attribut_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__categorie_attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Categorie_attribut_cenov_dev_ewan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categorie_attribut_cenov_dev_ewanFindFirstArgs} args - Arguments to find a Categorie_attribut_cenov_dev_ewan
     * @example
     * // Get one Categorie_attribut_cenov_dev_ewan
     * const categorie_attribut_cenov_dev_ewan = await prisma.categorie_attribut_cenov_dev_ewan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends categorie_attribut_cenov_dev_ewanFindFirstArgs>(args?: SelectSubset<T, categorie_attribut_cenov_dev_ewanFindFirstArgs<ExtArgs>>): Prisma__categorie_attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Categorie_attribut_cenov_dev_ewan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categorie_attribut_cenov_dev_ewanFindFirstOrThrowArgs} args - Arguments to find a Categorie_attribut_cenov_dev_ewan
     * @example
     * // Get one Categorie_attribut_cenov_dev_ewan
     * const categorie_attribut_cenov_dev_ewan = await prisma.categorie_attribut_cenov_dev_ewan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends categorie_attribut_cenov_dev_ewanFindFirstOrThrowArgs>(args?: SelectSubset<T, categorie_attribut_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>>): Prisma__categorie_attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Categorie_attribut_cenov_dev_ewans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categorie_attribut_cenov_dev_ewanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categorie_attribut_cenov_dev_ewans
     * const categorie_attribut_cenov_dev_ewans = await prisma.categorie_attribut_cenov_dev_ewan.findMany()
     * 
     * // Get first 10 Categorie_attribut_cenov_dev_ewans
     * const categorie_attribut_cenov_dev_ewans = await prisma.categorie_attribut_cenov_dev_ewan.findMany({ take: 10 })
     * 
     * // Only select the `fk_categorie`
     * const categorie_attribut_cenov_dev_ewanWithFk_categorieOnly = await prisma.categorie_attribut_cenov_dev_ewan.findMany({ select: { fk_categorie: true } })
     * 
     */
    findMany<T extends categorie_attribut_cenov_dev_ewanFindManyArgs>(args?: SelectSubset<T, categorie_attribut_cenov_dev_ewanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Categorie_attribut_cenov_dev_ewan.
     * @param {categorie_attribut_cenov_dev_ewanCreateArgs} args - Arguments to create a Categorie_attribut_cenov_dev_ewan.
     * @example
     * // Create one Categorie_attribut_cenov_dev_ewan
     * const Categorie_attribut_cenov_dev_ewan = await prisma.categorie_attribut_cenov_dev_ewan.create({
     *   data: {
     *     // ... data to create a Categorie_attribut_cenov_dev_ewan
     *   }
     * })
     * 
     */
    create<T extends categorie_attribut_cenov_dev_ewanCreateArgs>(args: SelectSubset<T, categorie_attribut_cenov_dev_ewanCreateArgs<ExtArgs>>): Prisma__categorie_attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Categorie_attribut_cenov_dev_ewans.
     * @param {categorie_attribut_cenov_dev_ewanCreateManyArgs} args - Arguments to create many Categorie_attribut_cenov_dev_ewans.
     * @example
     * // Create many Categorie_attribut_cenov_dev_ewans
     * const categorie_attribut_cenov_dev_ewan = await prisma.categorie_attribut_cenov_dev_ewan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends categorie_attribut_cenov_dev_ewanCreateManyArgs>(args?: SelectSubset<T, categorie_attribut_cenov_dev_ewanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categorie_attribut_cenov_dev_ewans and returns the data saved in the database.
     * @param {categorie_attribut_cenov_dev_ewanCreateManyAndReturnArgs} args - Arguments to create many Categorie_attribut_cenov_dev_ewans.
     * @example
     * // Create many Categorie_attribut_cenov_dev_ewans
     * const categorie_attribut_cenov_dev_ewan = await prisma.categorie_attribut_cenov_dev_ewan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categorie_attribut_cenov_dev_ewans and only return the `fk_categorie`
     * const categorie_attribut_cenov_dev_ewanWithFk_categorieOnly = await prisma.categorie_attribut_cenov_dev_ewan.createManyAndReturn({
     *   select: { fk_categorie: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends categorie_attribut_cenov_dev_ewanCreateManyAndReturnArgs>(args?: SelectSubset<T, categorie_attribut_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Categorie_attribut_cenov_dev_ewan.
     * @param {categorie_attribut_cenov_dev_ewanDeleteArgs} args - Arguments to delete one Categorie_attribut_cenov_dev_ewan.
     * @example
     * // Delete one Categorie_attribut_cenov_dev_ewan
     * const Categorie_attribut_cenov_dev_ewan = await prisma.categorie_attribut_cenov_dev_ewan.delete({
     *   where: {
     *     // ... filter to delete one Categorie_attribut_cenov_dev_ewan
     *   }
     * })
     * 
     */
    delete<T extends categorie_attribut_cenov_dev_ewanDeleteArgs>(args: SelectSubset<T, categorie_attribut_cenov_dev_ewanDeleteArgs<ExtArgs>>): Prisma__categorie_attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Categorie_attribut_cenov_dev_ewan.
     * @param {categorie_attribut_cenov_dev_ewanUpdateArgs} args - Arguments to update one Categorie_attribut_cenov_dev_ewan.
     * @example
     * // Update one Categorie_attribut_cenov_dev_ewan
     * const categorie_attribut_cenov_dev_ewan = await prisma.categorie_attribut_cenov_dev_ewan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends categorie_attribut_cenov_dev_ewanUpdateArgs>(args: SelectSubset<T, categorie_attribut_cenov_dev_ewanUpdateArgs<ExtArgs>>): Prisma__categorie_attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Categorie_attribut_cenov_dev_ewans.
     * @param {categorie_attribut_cenov_dev_ewanDeleteManyArgs} args - Arguments to filter Categorie_attribut_cenov_dev_ewans to delete.
     * @example
     * // Delete a few Categorie_attribut_cenov_dev_ewans
     * const { count } = await prisma.categorie_attribut_cenov_dev_ewan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends categorie_attribut_cenov_dev_ewanDeleteManyArgs>(args?: SelectSubset<T, categorie_attribut_cenov_dev_ewanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categorie_attribut_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categorie_attribut_cenov_dev_ewanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categorie_attribut_cenov_dev_ewans
     * const categorie_attribut_cenov_dev_ewan = await prisma.categorie_attribut_cenov_dev_ewan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends categorie_attribut_cenov_dev_ewanUpdateManyArgs>(args: SelectSubset<T, categorie_attribut_cenov_dev_ewanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categorie_attribut_cenov_dev_ewans and returns the data updated in the database.
     * @param {categorie_attribut_cenov_dev_ewanUpdateManyAndReturnArgs} args - Arguments to update many Categorie_attribut_cenov_dev_ewans.
     * @example
     * // Update many Categorie_attribut_cenov_dev_ewans
     * const categorie_attribut_cenov_dev_ewan = await prisma.categorie_attribut_cenov_dev_ewan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Categorie_attribut_cenov_dev_ewans and only return the `fk_categorie`
     * const categorie_attribut_cenov_dev_ewanWithFk_categorieOnly = await prisma.categorie_attribut_cenov_dev_ewan.updateManyAndReturn({
     *   select: { fk_categorie: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends categorie_attribut_cenov_dev_ewanUpdateManyAndReturnArgs>(args: SelectSubset<T, categorie_attribut_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Categorie_attribut_cenov_dev_ewan.
     * @param {categorie_attribut_cenov_dev_ewanUpsertArgs} args - Arguments to update or create a Categorie_attribut_cenov_dev_ewan.
     * @example
     * // Update or create a Categorie_attribut_cenov_dev_ewan
     * const categorie_attribut_cenov_dev_ewan = await prisma.categorie_attribut_cenov_dev_ewan.upsert({
     *   create: {
     *     // ... data to create a Categorie_attribut_cenov_dev_ewan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Categorie_attribut_cenov_dev_ewan we want to update
     *   }
     * })
     */
    upsert<T extends categorie_attribut_cenov_dev_ewanUpsertArgs>(args: SelectSubset<T, categorie_attribut_cenov_dev_ewanUpsertArgs<ExtArgs>>): Prisma__categorie_attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Categorie_attribut_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categorie_attribut_cenov_dev_ewanCountArgs} args - Arguments to filter Categorie_attribut_cenov_dev_ewans to count.
     * @example
     * // Count the number of Categorie_attribut_cenov_dev_ewans
     * const count = await prisma.categorie_attribut_cenov_dev_ewan.count({
     *   where: {
     *     // ... the filter for the Categorie_attribut_cenov_dev_ewans we want to count
     *   }
     * })
    **/
    count<T extends categorie_attribut_cenov_dev_ewanCountArgs>(
      args?: Subset<T, categorie_attribut_cenov_dev_ewanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Categorie_attribut_cenov_dev_ewanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Categorie_attribut_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Categorie_attribut_cenov_dev_ewanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Categorie_attribut_cenov_dev_ewanAggregateArgs>(args: Subset<T, Categorie_attribut_cenov_dev_ewanAggregateArgs>): Prisma.PrismaPromise<GetCategorie_attribut_cenov_dev_ewanAggregateType<T>>

    /**
     * Group by Categorie_attribut_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {categorie_attribut_cenov_dev_ewanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends categorie_attribut_cenov_dev_ewanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: categorie_attribut_cenov_dev_ewanGroupByArgs['orderBy'] }
        : { orderBy?: categorie_attribut_cenov_dev_ewanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, categorie_attribut_cenov_dev_ewanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategorie_attribut_cenov_dev_ewanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the categorie_attribut_cenov_dev_ewan model
   */
  readonly fields: categorie_attribut_cenov_dev_ewanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for categorie_attribut_cenov_dev_ewan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__categorie_attribut_cenov_dev_ewanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    attribut<T extends attribut_cenov_dev_ewanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, attribut_cenov_dev_ewanDefaultArgs<ExtArgs>>): Prisma__attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    categorie<T extends categorieDefaultArgs<ExtArgs> = {}>(args?: Subset<T, categorieDefaultArgs<ExtArgs>>): Prisma__categorieClient<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the categorie_attribut_cenov_dev_ewan model
   */
  interface categorie_attribut_cenov_dev_ewanFieldRefs {
    readonly fk_categorie: FieldRef<"categorie_attribut_cenov_dev_ewan", 'Int'>
    readonly fk_attribute: FieldRef<"categorie_attribut_cenov_dev_ewan", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * categorie_attribut_cenov_dev_ewan findUnique
   */
  export type categorie_attribut_cenov_dev_ewanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which categorie_attribut_cenov_dev_ewan to fetch.
     */
    where: categorie_attribut_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * categorie_attribut_cenov_dev_ewan findUniqueOrThrow
   */
  export type categorie_attribut_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which categorie_attribut_cenov_dev_ewan to fetch.
     */
    where: categorie_attribut_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * categorie_attribut_cenov_dev_ewan findFirst
   */
  export type categorie_attribut_cenov_dev_ewanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which categorie_attribut_cenov_dev_ewan to fetch.
     */
    where?: categorie_attribut_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categorie_attribut_cenov_dev_ewans to fetch.
     */
    orderBy?: categorie_attribut_cenov_dev_ewanOrderByWithRelationInput | categorie_attribut_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for categorie_attribut_cenov_dev_ewans.
     */
    cursor?: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categorie_attribut_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categorie_attribut_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of categorie_attribut_cenov_dev_ewans.
     */
    distinct?: Categorie_attribut_cenov_dev_ewanScalarFieldEnum | Categorie_attribut_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * categorie_attribut_cenov_dev_ewan findFirstOrThrow
   */
  export type categorie_attribut_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which categorie_attribut_cenov_dev_ewan to fetch.
     */
    where?: categorie_attribut_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categorie_attribut_cenov_dev_ewans to fetch.
     */
    orderBy?: categorie_attribut_cenov_dev_ewanOrderByWithRelationInput | categorie_attribut_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for categorie_attribut_cenov_dev_ewans.
     */
    cursor?: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categorie_attribut_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categorie_attribut_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of categorie_attribut_cenov_dev_ewans.
     */
    distinct?: Categorie_attribut_cenov_dev_ewanScalarFieldEnum | Categorie_attribut_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * categorie_attribut_cenov_dev_ewan findMany
   */
  export type categorie_attribut_cenov_dev_ewanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which categorie_attribut_cenov_dev_ewans to fetch.
     */
    where?: categorie_attribut_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of categorie_attribut_cenov_dev_ewans to fetch.
     */
    orderBy?: categorie_attribut_cenov_dev_ewanOrderByWithRelationInput | categorie_attribut_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing categorie_attribut_cenov_dev_ewans.
     */
    cursor?: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` categorie_attribut_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` categorie_attribut_cenov_dev_ewans.
     */
    skip?: number
    distinct?: Categorie_attribut_cenov_dev_ewanScalarFieldEnum | Categorie_attribut_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * categorie_attribut_cenov_dev_ewan create
   */
  export type categorie_attribut_cenov_dev_ewanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to create a categorie_attribut_cenov_dev_ewan.
     */
    data: XOR<categorie_attribut_cenov_dev_ewanCreateInput, categorie_attribut_cenov_dev_ewanUncheckedCreateInput>
  }

  /**
   * categorie_attribut_cenov_dev_ewan createMany
   */
  export type categorie_attribut_cenov_dev_ewanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many categorie_attribut_cenov_dev_ewans.
     */
    data: categorie_attribut_cenov_dev_ewanCreateManyInput | categorie_attribut_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * categorie_attribut_cenov_dev_ewan createManyAndReturn
   */
  export type categorie_attribut_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to create many categorie_attribut_cenov_dev_ewans.
     */
    data: categorie_attribut_cenov_dev_ewanCreateManyInput | categorie_attribut_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * categorie_attribut_cenov_dev_ewan update
   */
  export type categorie_attribut_cenov_dev_ewanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to update a categorie_attribut_cenov_dev_ewan.
     */
    data: XOR<categorie_attribut_cenov_dev_ewanUpdateInput, categorie_attribut_cenov_dev_ewanUncheckedUpdateInput>
    /**
     * Choose, which categorie_attribut_cenov_dev_ewan to update.
     */
    where: categorie_attribut_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * categorie_attribut_cenov_dev_ewan updateMany
   */
  export type categorie_attribut_cenov_dev_ewanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update categorie_attribut_cenov_dev_ewans.
     */
    data: XOR<categorie_attribut_cenov_dev_ewanUpdateManyMutationInput, categorie_attribut_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which categorie_attribut_cenov_dev_ewans to update
     */
    where?: categorie_attribut_cenov_dev_ewanWhereInput
    /**
     * Limit how many categorie_attribut_cenov_dev_ewans to update.
     */
    limit?: number
  }

  /**
   * categorie_attribut_cenov_dev_ewan updateManyAndReturn
   */
  export type categorie_attribut_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to update categorie_attribut_cenov_dev_ewans.
     */
    data: XOR<categorie_attribut_cenov_dev_ewanUpdateManyMutationInput, categorie_attribut_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which categorie_attribut_cenov_dev_ewans to update
     */
    where?: categorie_attribut_cenov_dev_ewanWhereInput
    /**
     * Limit how many categorie_attribut_cenov_dev_ewans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * categorie_attribut_cenov_dev_ewan upsert
   */
  export type categorie_attribut_cenov_dev_ewanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The filter to search for the categorie_attribut_cenov_dev_ewan to update in case it exists.
     */
    where: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    /**
     * In case the categorie_attribut_cenov_dev_ewan found by the `where` argument doesn't exist, create a new categorie_attribut_cenov_dev_ewan with this data.
     */
    create: XOR<categorie_attribut_cenov_dev_ewanCreateInput, categorie_attribut_cenov_dev_ewanUncheckedCreateInput>
    /**
     * In case the categorie_attribut_cenov_dev_ewan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<categorie_attribut_cenov_dev_ewanUpdateInput, categorie_attribut_cenov_dev_ewanUncheckedUpdateInput>
  }

  /**
   * categorie_attribut_cenov_dev_ewan delete
   */
  export type categorie_attribut_cenov_dev_ewanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter which categorie_attribut_cenov_dev_ewan to delete.
     */
    where: categorie_attribut_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * categorie_attribut_cenov_dev_ewan deleteMany
   */
  export type categorie_attribut_cenov_dev_ewanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which categorie_attribut_cenov_dev_ewans to delete
     */
    where?: categorie_attribut_cenov_dev_ewanWhereInput
    /**
     * Limit how many categorie_attribut_cenov_dev_ewans to delete.
     */
    limit?: number
  }

  /**
   * categorie_attribut_cenov_dev_ewan without action
   */
  export type categorie_attribut_cenov_dev_ewanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanInclude<ExtArgs> | null
  }


  /**
   * Model cross_ref
   */

  export type AggregateCross_ref = {
    _count: Cross_refCountAggregateOutputType | null
    _avg: Cross_refAvgAggregateOutputType | null
    _sum: Cross_refSumAggregateOutputType | null
    _min: Cross_refMinAggregateOutputType | null
    _max: Cross_refMaxAggregateOutputType | null
  }

  export type Cross_refAvgAggregateOutputType = {
    crf_id: number | null
    fk_produit: number | null
  }

  export type Cross_refSumAggregateOutputType = {
    crf_id: number | null
    fk_produit: number | null
  }

  export type Cross_refMinAggregateOutputType = {
    crf_id: number | null
    fk_produit: number | null
  }

  export type Cross_refMaxAggregateOutputType = {
    crf_id: number | null
    fk_produit: number | null
  }

  export type Cross_refCountAggregateOutputType = {
    crf_id: number
    fk_produit: number
    _all: number
  }


  export type Cross_refAvgAggregateInputType = {
    crf_id?: true
    fk_produit?: true
  }

  export type Cross_refSumAggregateInputType = {
    crf_id?: true
    fk_produit?: true
  }

  export type Cross_refMinAggregateInputType = {
    crf_id?: true
    fk_produit?: true
  }

  export type Cross_refMaxAggregateInputType = {
    crf_id?: true
    fk_produit?: true
  }

  export type Cross_refCountAggregateInputType = {
    crf_id?: true
    fk_produit?: true
    _all?: true
  }

  export type Cross_refAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which cross_ref to aggregate.
     */
    where?: cross_refWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of cross_refs to fetch.
     */
    orderBy?: cross_refOrderByWithRelationInput | cross_refOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: cross_refWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` cross_refs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` cross_refs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned cross_refs
    **/
    _count?: true | Cross_refCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Cross_refAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Cross_refSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Cross_refMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Cross_refMaxAggregateInputType
  }

  export type GetCross_refAggregateType<T extends Cross_refAggregateArgs> = {
        [P in keyof T & keyof AggregateCross_ref]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCross_ref[P]>
      : GetScalarType<T[P], AggregateCross_ref[P]>
  }




  export type cross_refGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: cross_refWhereInput
    orderBy?: cross_refOrderByWithAggregationInput | cross_refOrderByWithAggregationInput[]
    by: Cross_refScalarFieldEnum[] | Cross_refScalarFieldEnum
    having?: cross_refScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Cross_refCountAggregateInputType | true
    _avg?: Cross_refAvgAggregateInputType
    _sum?: Cross_refSumAggregateInputType
    _min?: Cross_refMinAggregateInputType
    _max?: Cross_refMaxAggregateInputType
  }

  export type Cross_refGroupByOutputType = {
    crf_id: number
    fk_produit: number
    _count: Cross_refCountAggregateOutputType | null
    _avg: Cross_refAvgAggregateOutputType | null
    _sum: Cross_refSumAggregateOutputType | null
    _min: Cross_refMinAggregateOutputType | null
    _max: Cross_refMaxAggregateOutputType | null
  }

  type GetCross_refGroupByPayload<T extends cross_refGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Cross_refGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Cross_refGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Cross_refGroupByOutputType[P]>
            : GetScalarType<T[P], Cross_refGroupByOutputType[P]>
        }
      >
    >


  export type cross_refSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    crf_id?: boolean
    fk_produit?: boolean
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cross_ref"]>

  export type cross_refSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    crf_id?: boolean
    fk_produit?: boolean
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cross_ref"]>

  export type cross_refSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    crf_id?: boolean
    fk_produit?: boolean
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cross_ref"]>

  export type cross_refSelectScalar = {
    crf_id?: boolean
    fk_produit?: boolean
  }

  export type cross_refOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"crf_id" | "fk_produit", ExtArgs["result"]["cross_ref"]>
  export type cross_refInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }
  export type cross_refIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }
  export type cross_refIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }

  export type $cross_refPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "cross_ref"
    objects: {
      produit: Prisma.$produitPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      crf_id: number
      fk_produit: number
    }, ExtArgs["result"]["cross_ref"]>
    composites: {}
  }

  type cross_refGetPayload<S extends boolean | null | undefined | cross_refDefaultArgs> = $Result.GetResult<Prisma.$cross_refPayload, S>

  type cross_refCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<cross_refFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Cross_refCountAggregateInputType | true
    }

  export interface cross_refDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['cross_ref'], meta: { name: 'cross_ref' } }
    /**
     * Find zero or one Cross_ref that matches the filter.
     * @param {cross_refFindUniqueArgs} args - Arguments to find a Cross_ref
     * @example
     * // Get one Cross_ref
     * const cross_ref = await prisma.cross_ref.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends cross_refFindUniqueArgs>(args: SelectSubset<T, cross_refFindUniqueArgs<ExtArgs>>): Prisma__cross_refClient<$Result.GetResult<Prisma.$cross_refPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Cross_ref that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {cross_refFindUniqueOrThrowArgs} args - Arguments to find a Cross_ref
     * @example
     * // Get one Cross_ref
     * const cross_ref = await prisma.cross_ref.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends cross_refFindUniqueOrThrowArgs>(args: SelectSubset<T, cross_refFindUniqueOrThrowArgs<ExtArgs>>): Prisma__cross_refClient<$Result.GetResult<Prisma.$cross_refPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cross_ref that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {cross_refFindFirstArgs} args - Arguments to find a Cross_ref
     * @example
     * // Get one Cross_ref
     * const cross_ref = await prisma.cross_ref.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends cross_refFindFirstArgs>(args?: SelectSubset<T, cross_refFindFirstArgs<ExtArgs>>): Prisma__cross_refClient<$Result.GetResult<Prisma.$cross_refPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cross_ref that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {cross_refFindFirstOrThrowArgs} args - Arguments to find a Cross_ref
     * @example
     * // Get one Cross_ref
     * const cross_ref = await prisma.cross_ref.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends cross_refFindFirstOrThrowArgs>(args?: SelectSubset<T, cross_refFindFirstOrThrowArgs<ExtArgs>>): Prisma__cross_refClient<$Result.GetResult<Prisma.$cross_refPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cross_refs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {cross_refFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cross_refs
     * const cross_refs = await prisma.cross_ref.findMany()
     * 
     * // Get first 10 Cross_refs
     * const cross_refs = await prisma.cross_ref.findMany({ take: 10 })
     * 
     * // Only select the `crf_id`
     * const cross_refWithCrf_idOnly = await prisma.cross_ref.findMany({ select: { crf_id: true } })
     * 
     */
    findMany<T extends cross_refFindManyArgs>(args?: SelectSubset<T, cross_refFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$cross_refPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Cross_ref.
     * @param {cross_refCreateArgs} args - Arguments to create a Cross_ref.
     * @example
     * // Create one Cross_ref
     * const Cross_ref = await prisma.cross_ref.create({
     *   data: {
     *     // ... data to create a Cross_ref
     *   }
     * })
     * 
     */
    create<T extends cross_refCreateArgs>(args: SelectSubset<T, cross_refCreateArgs<ExtArgs>>): Prisma__cross_refClient<$Result.GetResult<Prisma.$cross_refPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cross_refs.
     * @param {cross_refCreateManyArgs} args - Arguments to create many Cross_refs.
     * @example
     * // Create many Cross_refs
     * const cross_ref = await prisma.cross_ref.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends cross_refCreateManyArgs>(args?: SelectSubset<T, cross_refCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cross_refs and returns the data saved in the database.
     * @param {cross_refCreateManyAndReturnArgs} args - Arguments to create many Cross_refs.
     * @example
     * // Create many Cross_refs
     * const cross_ref = await prisma.cross_ref.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cross_refs and only return the `crf_id`
     * const cross_refWithCrf_idOnly = await prisma.cross_ref.createManyAndReturn({
     *   select: { crf_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends cross_refCreateManyAndReturnArgs>(args?: SelectSubset<T, cross_refCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$cross_refPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Cross_ref.
     * @param {cross_refDeleteArgs} args - Arguments to delete one Cross_ref.
     * @example
     * // Delete one Cross_ref
     * const Cross_ref = await prisma.cross_ref.delete({
     *   where: {
     *     // ... filter to delete one Cross_ref
     *   }
     * })
     * 
     */
    delete<T extends cross_refDeleteArgs>(args: SelectSubset<T, cross_refDeleteArgs<ExtArgs>>): Prisma__cross_refClient<$Result.GetResult<Prisma.$cross_refPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Cross_ref.
     * @param {cross_refUpdateArgs} args - Arguments to update one Cross_ref.
     * @example
     * // Update one Cross_ref
     * const cross_ref = await prisma.cross_ref.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends cross_refUpdateArgs>(args: SelectSubset<T, cross_refUpdateArgs<ExtArgs>>): Prisma__cross_refClient<$Result.GetResult<Prisma.$cross_refPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cross_refs.
     * @param {cross_refDeleteManyArgs} args - Arguments to filter Cross_refs to delete.
     * @example
     * // Delete a few Cross_refs
     * const { count } = await prisma.cross_ref.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends cross_refDeleteManyArgs>(args?: SelectSubset<T, cross_refDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cross_refs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {cross_refUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cross_refs
     * const cross_ref = await prisma.cross_ref.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends cross_refUpdateManyArgs>(args: SelectSubset<T, cross_refUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cross_refs and returns the data updated in the database.
     * @param {cross_refUpdateManyAndReturnArgs} args - Arguments to update many Cross_refs.
     * @example
     * // Update many Cross_refs
     * const cross_ref = await prisma.cross_ref.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Cross_refs and only return the `crf_id`
     * const cross_refWithCrf_idOnly = await prisma.cross_ref.updateManyAndReturn({
     *   select: { crf_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends cross_refUpdateManyAndReturnArgs>(args: SelectSubset<T, cross_refUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$cross_refPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Cross_ref.
     * @param {cross_refUpsertArgs} args - Arguments to update or create a Cross_ref.
     * @example
     * // Update or create a Cross_ref
     * const cross_ref = await prisma.cross_ref.upsert({
     *   create: {
     *     // ... data to create a Cross_ref
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cross_ref we want to update
     *   }
     * })
     */
    upsert<T extends cross_refUpsertArgs>(args: SelectSubset<T, cross_refUpsertArgs<ExtArgs>>): Prisma__cross_refClient<$Result.GetResult<Prisma.$cross_refPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cross_refs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {cross_refCountArgs} args - Arguments to filter Cross_refs to count.
     * @example
     * // Count the number of Cross_refs
     * const count = await prisma.cross_ref.count({
     *   where: {
     *     // ... the filter for the Cross_refs we want to count
     *   }
     * })
    **/
    count<T extends cross_refCountArgs>(
      args?: Subset<T, cross_refCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Cross_refCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cross_ref.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Cross_refAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Cross_refAggregateArgs>(args: Subset<T, Cross_refAggregateArgs>): Prisma.PrismaPromise<GetCross_refAggregateType<T>>

    /**
     * Group by Cross_ref.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {cross_refGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends cross_refGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: cross_refGroupByArgs['orderBy'] }
        : { orderBy?: cross_refGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, cross_refGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCross_refGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the cross_ref model
   */
  readonly fields: cross_refFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for cross_ref.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__cross_refClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    produit<T extends produitDefaultArgs<ExtArgs> = {}>(args?: Subset<T, produitDefaultArgs<ExtArgs>>): Prisma__produitClient<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the cross_ref model
   */
  interface cross_refFieldRefs {
    readonly crf_id: FieldRef<"cross_ref", 'Int'>
    readonly fk_produit: FieldRef<"cross_ref", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * cross_ref findUnique
   */
  export type cross_refFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelect<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refInclude<ExtArgs> | null
    /**
     * Filter, which cross_ref to fetch.
     */
    where: cross_refWhereUniqueInput
  }

  /**
   * cross_ref findUniqueOrThrow
   */
  export type cross_refFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelect<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refInclude<ExtArgs> | null
    /**
     * Filter, which cross_ref to fetch.
     */
    where: cross_refWhereUniqueInput
  }

  /**
   * cross_ref findFirst
   */
  export type cross_refFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelect<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refInclude<ExtArgs> | null
    /**
     * Filter, which cross_ref to fetch.
     */
    where?: cross_refWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of cross_refs to fetch.
     */
    orderBy?: cross_refOrderByWithRelationInput | cross_refOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for cross_refs.
     */
    cursor?: cross_refWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` cross_refs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` cross_refs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of cross_refs.
     */
    distinct?: Cross_refScalarFieldEnum | Cross_refScalarFieldEnum[]
  }

  /**
   * cross_ref findFirstOrThrow
   */
  export type cross_refFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelect<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refInclude<ExtArgs> | null
    /**
     * Filter, which cross_ref to fetch.
     */
    where?: cross_refWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of cross_refs to fetch.
     */
    orderBy?: cross_refOrderByWithRelationInput | cross_refOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for cross_refs.
     */
    cursor?: cross_refWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` cross_refs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` cross_refs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of cross_refs.
     */
    distinct?: Cross_refScalarFieldEnum | Cross_refScalarFieldEnum[]
  }

  /**
   * cross_ref findMany
   */
  export type cross_refFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelect<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refInclude<ExtArgs> | null
    /**
     * Filter, which cross_refs to fetch.
     */
    where?: cross_refWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of cross_refs to fetch.
     */
    orderBy?: cross_refOrderByWithRelationInput | cross_refOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing cross_refs.
     */
    cursor?: cross_refWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` cross_refs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` cross_refs.
     */
    skip?: number
    distinct?: Cross_refScalarFieldEnum | Cross_refScalarFieldEnum[]
  }

  /**
   * cross_ref create
   */
  export type cross_refCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelect<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refInclude<ExtArgs> | null
    /**
     * The data needed to create a cross_ref.
     */
    data: XOR<cross_refCreateInput, cross_refUncheckedCreateInput>
  }

  /**
   * cross_ref createMany
   */
  export type cross_refCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many cross_refs.
     */
    data: cross_refCreateManyInput | cross_refCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * cross_ref createManyAndReturn
   */
  export type cross_refCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * The data used to create many cross_refs.
     */
    data: cross_refCreateManyInput | cross_refCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * cross_ref update
   */
  export type cross_refUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelect<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refInclude<ExtArgs> | null
    /**
     * The data needed to update a cross_ref.
     */
    data: XOR<cross_refUpdateInput, cross_refUncheckedUpdateInput>
    /**
     * Choose, which cross_ref to update.
     */
    where: cross_refWhereUniqueInput
  }

  /**
   * cross_ref updateMany
   */
  export type cross_refUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update cross_refs.
     */
    data: XOR<cross_refUpdateManyMutationInput, cross_refUncheckedUpdateManyInput>
    /**
     * Filter which cross_refs to update
     */
    where?: cross_refWhereInput
    /**
     * Limit how many cross_refs to update.
     */
    limit?: number
  }

  /**
   * cross_ref updateManyAndReturn
   */
  export type cross_refUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * The data used to update cross_refs.
     */
    data: XOR<cross_refUpdateManyMutationInput, cross_refUncheckedUpdateManyInput>
    /**
     * Filter which cross_refs to update
     */
    where?: cross_refWhereInput
    /**
     * Limit how many cross_refs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * cross_ref upsert
   */
  export type cross_refUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelect<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refInclude<ExtArgs> | null
    /**
     * The filter to search for the cross_ref to update in case it exists.
     */
    where: cross_refWhereUniqueInput
    /**
     * In case the cross_ref found by the `where` argument doesn't exist, create a new cross_ref with this data.
     */
    create: XOR<cross_refCreateInput, cross_refUncheckedCreateInput>
    /**
     * In case the cross_ref was found with the provided `where` argument, update it with this data.
     */
    update: XOR<cross_refUpdateInput, cross_refUncheckedUpdateInput>
  }

  /**
   * cross_ref delete
   */
  export type cross_refDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelect<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refInclude<ExtArgs> | null
    /**
     * Filter which cross_ref to delete.
     */
    where: cross_refWhereUniqueInput
  }

  /**
   * cross_ref deleteMany
   */
  export type cross_refDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which cross_refs to delete
     */
    where?: cross_refWhereInput
    /**
     * Limit how many cross_refs to delete.
     */
    limit?: number
  }

  /**
   * cross_ref without action
   */
  export type cross_refDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelect<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refInclude<ExtArgs> | null
  }


  /**
   * Model famille
   */

  export type AggregateFamille = {
    _count: FamilleCountAggregateOutputType | null
    _avg: FamilleAvgAggregateOutputType | null
    _sum: FamilleSumAggregateOutputType | null
    _min: FamilleMinAggregateOutputType | null
    _max: FamilleMaxAggregateOutputType | null
  }

  export type FamilleAvgAggregateOutputType = {
    fam_id: number | null
    fk_parent: number | null
    fk_supplier: number | null
  }

  export type FamilleSumAggregateOutputType = {
    fam_id: number | null
    fk_parent: number | null
    fk_supplier: number | null
  }

  export type FamilleMinAggregateOutputType = {
    fam_id: number | null
    fk_parent: number | null
    fam_code: string | null
    fam_label: string | null
    fk_supplier: number | null
  }

  export type FamilleMaxAggregateOutputType = {
    fam_id: number | null
    fk_parent: number | null
    fam_code: string | null
    fam_label: string | null
    fk_supplier: number | null
  }

  export type FamilleCountAggregateOutputType = {
    fam_id: number
    fk_parent: number
    fam_code: number
    fam_label: number
    fk_supplier: number
    _all: number
  }


  export type FamilleAvgAggregateInputType = {
    fam_id?: true
    fk_parent?: true
    fk_supplier?: true
  }

  export type FamilleSumAggregateInputType = {
    fam_id?: true
    fk_parent?: true
    fk_supplier?: true
  }

  export type FamilleMinAggregateInputType = {
    fam_id?: true
    fk_parent?: true
    fam_code?: true
    fam_label?: true
    fk_supplier?: true
  }

  export type FamilleMaxAggregateInputType = {
    fam_id?: true
    fk_parent?: true
    fam_code?: true
    fam_label?: true
    fk_supplier?: true
  }

  export type FamilleCountAggregateInputType = {
    fam_id?: true
    fk_parent?: true
    fam_code?: true
    fam_label?: true
    fk_supplier?: true
    _all?: true
  }

  export type FamilleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which famille to aggregate.
     */
    where?: familleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of familles to fetch.
     */
    orderBy?: familleOrderByWithRelationInput | familleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: familleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` familles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` familles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned familles
    **/
    _count?: true | FamilleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FamilleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FamilleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FamilleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FamilleMaxAggregateInputType
  }

  export type GetFamilleAggregateType<T extends FamilleAggregateArgs> = {
        [P in keyof T & keyof AggregateFamille]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFamille[P]>
      : GetScalarType<T[P], AggregateFamille[P]>
  }




  export type familleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: familleWhereInput
    orderBy?: familleOrderByWithAggregationInput | familleOrderByWithAggregationInput[]
    by: FamilleScalarFieldEnum[] | FamilleScalarFieldEnum
    having?: familleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FamilleCountAggregateInputType | true
    _avg?: FamilleAvgAggregateInputType
    _sum?: FamilleSumAggregateInputType
    _min?: FamilleMinAggregateInputType
    _max?: FamilleMaxAggregateInputType
  }

  export type FamilleGroupByOutputType = {
    fam_id: number
    fk_parent: number | null
    fam_code: string | null
    fam_label: string | null
    fk_supplier: number
    _count: FamilleCountAggregateOutputType | null
    _avg: FamilleAvgAggregateOutputType | null
    _sum: FamilleSumAggregateOutputType | null
    _min: FamilleMinAggregateOutputType | null
    _max: FamilleMaxAggregateOutputType | null
  }

  type GetFamilleGroupByPayload<T extends familleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FamilleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FamilleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FamilleGroupByOutputType[P]>
            : GetScalarType<T[P], FamilleGroupByOutputType[P]>
        }
      >
    >


  export type familleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fam_id?: boolean
    fk_parent?: boolean
    fam_code?: boolean
    fam_label?: boolean
    fk_supplier?: boolean
    fournisseur?: boolean | fournisseurDefaultArgs<ExtArgs>
    famille?: boolean | famille$familleArgs<ExtArgs>
    other_famille?: boolean | famille$other_familleArgs<ExtArgs>
    _count?: boolean | FamilleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["famille"]>

  export type familleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fam_id?: boolean
    fk_parent?: boolean
    fam_code?: boolean
    fam_label?: boolean
    fk_supplier?: boolean
    fournisseur?: boolean | fournisseurDefaultArgs<ExtArgs>
    famille?: boolean | famille$familleArgs<ExtArgs>
  }, ExtArgs["result"]["famille"]>

  export type familleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fam_id?: boolean
    fk_parent?: boolean
    fam_code?: boolean
    fam_label?: boolean
    fk_supplier?: boolean
    fournisseur?: boolean | fournisseurDefaultArgs<ExtArgs>
    famille?: boolean | famille$familleArgs<ExtArgs>
  }, ExtArgs["result"]["famille"]>

  export type familleSelectScalar = {
    fam_id?: boolean
    fk_parent?: boolean
    fam_code?: boolean
    fam_label?: boolean
    fk_supplier?: boolean
  }

  export type familleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"fam_id" | "fk_parent" | "fam_code" | "fam_label" | "fk_supplier", ExtArgs["result"]["famille"]>
  export type familleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fournisseur?: boolean | fournisseurDefaultArgs<ExtArgs>
    famille?: boolean | famille$familleArgs<ExtArgs>
    other_famille?: boolean | famille$other_familleArgs<ExtArgs>
    _count?: boolean | FamilleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type familleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fournisseur?: boolean | fournisseurDefaultArgs<ExtArgs>
    famille?: boolean | famille$familleArgs<ExtArgs>
  }
  export type familleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fournisseur?: boolean | fournisseurDefaultArgs<ExtArgs>
    famille?: boolean | famille$familleArgs<ExtArgs>
  }

  export type $famillePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "famille"
    objects: {
      fournisseur: Prisma.$fournisseurPayload<ExtArgs>
      famille: Prisma.$famillePayload<ExtArgs> | null
      other_famille: Prisma.$famillePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      fam_id: number
      fk_parent: number | null
      fam_code: string | null
      fam_label: string | null
      fk_supplier: number
    }, ExtArgs["result"]["famille"]>
    composites: {}
  }

  type familleGetPayload<S extends boolean | null | undefined | familleDefaultArgs> = $Result.GetResult<Prisma.$famillePayload, S>

  type familleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<familleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FamilleCountAggregateInputType | true
    }

  export interface familleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['famille'], meta: { name: 'famille' } }
    /**
     * Find zero or one Famille that matches the filter.
     * @param {familleFindUniqueArgs} args - Arguments to find a Famille
     * @example
     * // Get one Famille
     * const famille = await prisma.famille.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends familleFindUniqueArgs>(args: SelectSubset<T, familleFindUniqueArgs<ExtArgs>>): Prisma__familleClient<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Famille that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {familleFindUniqueOrThrowArgs} args - Arguments to find a Famille
     * @example
     * // Get one Famille
     * const famille = await prisma.famille.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends familleFindUniqueOrThrowArgs>(args: SelectSubset<T, familleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__familleClient<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Famille that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {familleFindFirstArgs} args - Arguments to find a Famille
     * @example
     * // Get one Famille
     * const famille = await prisma.famille.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends familleFindFirstArgs>(args?: SelectSubset<T, familleFindFirstArgs<ExtArgs>>): Prisma__familleClient<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Famille that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {familleFindFirstOrThrowArgs} args - Arguments to find a Famille
     * @example
     * // Get one Famille
     * const famille = await prisma.famille.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends familleFindFirstOrThrowArgs>(args?: SelectSubset<T, familleFindFirstOrThrowArgs<ExtArgs>>): Prisma__familleClient<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Familles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {familleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Familles
     * const familles = await prisma.famille.findMany()
     * 
     * // Get first 10 Familles
     * const familles = await prisma.famille.findMany({ take: 10 })
     * 
     * // Only select the `fam_id`
     * const familleWithFam_idOnly = await prisma.famille.findMany({ select: { fam_id: true } })
     * 
     */
    findMany<T extends familleFindManyArgs>(args?: SelectSubset<T, familleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Famille.
     * @param {familleCreateArgs} args - Arguments to create a Famille.
     * @example
     * // Create one Famille
     * const Famille = await prisma.famille.create({
     *   data: {
     *     // ... data to create a Famille
     *   }
     * })
     * 
     */
    create<T extends familleCreateArgs>(args: SelectSubset<T, familleCreateArgs<ExtArgs>>): Prisma__familleClient<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Familles.
     * @param {familleCreateManyArgs} args - Arguments to create many Familles.
     * @example
     * // Create many Familles
     * const famille = await prisma.famille.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends familleCreateManyArgs>(args?: SelectSubset<T, familleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Familles and returns the data saved in the database.
     * @param {familleCreateManyAndReturnArgs} args - Arguments to create many Familles.
     * @example
     * // Create many Familles
     * const famille = await prisma.famille.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Familles and only return the `fam_id`
     * const familleWithFam_idOnly = await prisma.famille.createManyAndReturn({
     *   select: { fam_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends familleCreateManyAndReturnArgs>(args?: SelectSubset<T, familleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Famille.
     * @param {familleDeleteArgs} args - Arguments to delete one Famille.
     * @example
     * // Delete one Famille
     * const Famille = await prisma.famille.delete({
     *   where: {
     *     // ... filter to delete one Famille
     *   }
     * })
     * 
     */
    delete<T extends familleDeleteArgs>(args: SelectSubset<T, familleDeleteArgs<ExtArgs>>): Prisma__familleClient<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Famille.
     * @param {familleUpdateArgs} args - Arguments to update one Famille.
     * @example
     * // Update one Famille
     * const famille = await prisma.famille.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends familleUpdateArgs>(args: SelectSubset<T, familleUpdateArgs<ExtArgs>>): Prisma__familleClient<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Familles.
     * @param {familleDeleteManyArgs} args - Arguments to filter Familles to delete.
     * @example
     * // Delete a few Familles
     * const { count } = await prisma.famille.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends familleDeleteManyArgs>(args?: SelectSubset<T, familleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Familles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {familleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Familles
     * const famille = await prisma.famille.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends familleUpdateManyArgs>(args: SelectSubset<T, familleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Familles and returns the data updated in the database.
     * @param {familleUpdateManyAndReturnArgs} args - Arguments to update many Familles.
     * @example
     * // Update many Familles
     * const famille = await prisma.famille.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Familles and only return the `fam_id`
     * const familleWithFam_idOnly = await prisma.famille.updateManyAndReturn({
     *   select: { fam_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends familleUpdateManyAndReturnArgs>(args: SelectSubset<T, familleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Famille.
     * @param {familleUpsertArgs} args - Arguments to update or create a Famille.
     * @example
     * // Update or create a Famille
     * const famille = await prisma.famille.upsert({
     *   create: {
     *     // ... data to create a Famille
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Famille we want to update
     *   }
     * })
     */
    upsert<T extends familleUpsertArgs>(args: SelectSubset<T, familleUpsertArgs<ExtArgs>>): Prisma__familleClient<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Familles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {familleCountArgs} args - Arguments to filter Familles to count.
     * @example
     * // Count the number of Familles
     * const count = await prisma.famille.count({
     *   where: {
     *     // ... the filter for the Familles we want to count
     *   }
     * })
    **/
    count<T extends familleCountArgs>(
      args?: Subset<T, familleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FamilleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Famille.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FamilleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FamilleAggregateArgs>(args: Subset<T, FamilleAggregateArgs>): Prisma.PrismaPromise<GetFamilleAggregateType<T>>

    /**
     * Group by Famille.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {familleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends familleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: familleGroupByArgs['orderBy'] }
        : { orderBy?: familleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, familleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFamilleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the famille model
   */
  readonly fields: familleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for famille.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__familleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    fournisseur<T extends fournisseurDefaultArgs<ExtArgs> = {}>(args?: Subset<T, fournisseurDefaultArgs<ExtArgs>>): Prisma__fournisseurClient<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    famille<T extends famille$familleArgs<ExtArgs> = {}>(args?: Subset<T, famille$familleArgs<ExtArgs>>): Prisma__familleClient<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    other_famille<T extends famille$other_familleArgs<ExtArgs> = {}>(args?: Subset<T, famille$other_familleArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the famille model
   */
  interface familleFieldRefs {
    readonly fam_id: FieldRef<"famille", 'Int'>
    readonly fk_parent: FieldRef<"famille", 'Int'>
    readonly fam_code: FieldRef<"famille", 'String'>
    readonly fam_label: FieldRef<"famille", 'String'>
    readonly fk_supplier: FieldRef<"famille", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * famille findUnique
   */
  export type familleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
    /**
     * Filter, which famille to fetch.
     */
    where: familleWhereUniqueInput
  }

  /**
   * famille findUniqueOrThrow
   */
  export type familleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
    /**
     * Filter, which famille to fetch.
     */
    where: familleWhereUniqueInput
  }

  /**
   * famille findFirst
   */
  export type familleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
    /**
     * Filter, which famille to fetch.
     */
    where?: familleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of familles to fetch.
     */
    orderBy?: familleOrderByWithRelationInput | familleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for familles.
     */
    cursor?: familleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` familles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` familles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of familles.
     */
    distinct?: FamilleScalarFieldEnum | FamilleScalarFieldEnum[]
  }

  /**
   * famille findFirstOrThrow
   */
  export type familleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
    /**
     * Filter, which famille to fetch.
     */
    where?: familleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of familles to fetch.
     */
    orderBy?: familleOrderByWithRelationInput | familleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for familles.
     */
    cursor?: familleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` familles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` familles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of familles.
     */
    distinct?: FamilleScalarFieldEnum | FamilleScalarFieldEnum[]
  }

  /**
   * famille findMany
   */
  export type familleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
    /**
     * Filter, which familles to fetch.
     */
    where?: familleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of familles to fetch.
     */
    orderBy?: familleOrderByWithRelationInput | familleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing familles.
     */
    cursor?: familleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` familles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` familles.
     */
    skip?: number
    distinct?: FamilleScalarFieldEnum | FamilleScalarFieldEnum[]
  }

  /**
   * famille create
   */
  export type familleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
    /**
     * The data needed to create a famille.
     */
    data: XOR<familleCreateInput, familleUncheckedCreateInput>
  }

  /**
   * famille createMany
   */
  export type familleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many familles.
     */
    data: familleCreateManyInput | familleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * famille createManyAndReturn
   */
  export type familleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * The data used to create many familles.
     */
    data: familleCreateManyInput | familleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * famille update
   */
  export type familleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
    /**
     * The data needed to update a famille.
     */
    data: XOR<familleUpdateInput, familleUncheckedUpdateInput>
    /**
     * Choose, which famille to update.
     */
    where: familleWhereUniqueInput
  }

  /**
   * famille updateMany
   */
  export type familleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update familles.
     */
    data: XOR<familleUpdateManyMutationInput, familleUncheckedUpdateManyInput>
    /**
     * Filter which familles to update
     */
    where?: familleWhereInput
    /**
     * Limit how many familles to update.
     */
    limit?: number
  }

  /**
   * famille updateManyAndReturn
   */
  export type familleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * The data used to update familles.
     */
    data: XOR<familleUpdateManyMutationInput, familleUncheckedUpdateManyInput>
    /**
     * Filter which familles to update
     */
    where?: familleWhereInput
    /**
     * Limit how many familles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * famille upsert
   */
  export type familleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
    /**
     * The filter to search for the famille to update in case it exists.
     */
    where: familleWhereUniqueInput
    /**
     * In case the famille found by the `where` argument doesn't exist, create a new famille with this data.
     */
    create: XOR<familleCreateInput, familleUncheckedCreateInput>
    /**
     * In case the famille was found with the provided `where` argument, update it with this data.
     */
    update: XOR<familleUpdateInput, familleUncheckedUpdateInput>
  }

  /**
   * famille delete
   */
  export type familleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
    /**
     * Filter which famille to delete.
     */
    where: familleWhereUniqueInput
  }

  /**
   * famille deleteMany
   */
  export type familleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which familles to delete
     */
    where?: familleWhereInput
    /**
     * Limit how many familles to delete.
     */
    limit?: number
  }

  /**
   * famille.famille
   */
  export type famille$familleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
    where?: familleWhereInput
  }

  /**
   * famille.other_famille
   */
  export type famille$other_familleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
    where?: familleWhereInput
    orderBy?: familleOrderByWithRelationInput | familleOrderByWithRelationInput[]
    cursor?: familleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FamilleScalarFieldEnum | FamilleScalarFieldEnum[]
  }

  /**
   * famille without action
   */
  export type familleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
  }


  /**
   * Model produit
   */

  export type AggregateProduit = {
    _count: ProduitCountAggregateOutputType | null
    _avg: ProduitAvgAggregateOutputType | null
    _sum: ProduitSumAggregateOutputType | null
    _min: ProduitMinAggregateOutputType | null
    _max: ProduitMaxAggregateOutputType | null
  }

  export type ProduitAvgAggregateOutputType = {
    pro_id: number | null
    fk_supplier: number | null
    fk_kit: number | null
    fk_famille: number | null
    fk_sfamille: number | null
    fk_ssfamille: number | null
  }

  export type ProduitSumAggregateOutputType = {
    pro_id: number | null
    fk_supplier: number | null
    fk_kit: number | null
    fk_famille: number | null
    fk_sfamille: number | null
    fk_ssfamille: number | null
  }

  export type ProduitMinAggregateOutputType = {
    pro_id: number | null
    pro_code: string | null
    fk_supplier: number | null
    fk_kit: number | null
    fk_famille: number | null
    fk_sfamille: number | null
    fk_ssfamille: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProduitMaxAggregateOutputType = {
    pro_id: number | null
    pro_code: string | null
    fk_supplier: number | null
    fk_kit: number | null
    fk_famille: number | null
    fk_sfamille: number | null
    fk_ssfamille: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProduitCountAggregateOutputType = {
    pro_id: number
    pro_code: number
    fk_supplier: number
    fk_kit: number
    fk_famille: number
    fk_sfamille: number
    fk_ssfamille: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ProduitAvgAggregateInputType = {
    pro_id?: true
    fk_supplier?: true
    fk_kit?: true
    fk_famille?: true
    fk_sfamille?: true
    fk_ssfamille?: true
  }

  export type ProduitSumAggregateInputType = {
    pro_id?: true
    fk_supplier?: true
    fk_kit?: true
    fk_famille?: true
    fk_sfamille?: true
    fk_ssfamille?: true
  }

  export type ProduitMinAggregateInputType = {
    pro_id?: true
    pro_code?: true
    fk_supplier?: true
    fk_kit?: true
    fk_famille?: true
    fk_sfamille?: true
    fk_ssfamille?: true
    created_at?: true
    updated_at?: true
  }

  export type ProduitMaxAggregateInputType = {
    pro_id?: true
    pro_code?: true
    fk_supplier?: true
    fk_kit?: true
    fk_famille?: true
    fk_sfamille?: true
    fk_ssfamille?: true
    created_at?: true
    updated_at?: true
  }

  export type ProduitCountAggregateInputType = {
    pro_id?: true
    pro_code?: true
    fk_supplier?: true
    fk_kit?: true
    fk_famille?: true
    fk_sfamille?: true
    fk_ssfamille?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ProduitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which produit to aggregate.
     */
    where?: produitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of produits to fetch.
     */
    orderBy?: produitOrderByWithRelationInput | produitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: produitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` produits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` produits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned produits
    **/
    _count?: true | ProduitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProduitAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProduitSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProduitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProduitMaxAggregateInputType
  }

  export type GetProduitAggregateType<T extends ProduitAggregateArgs> = {
        [P in keyof T & keyof AggregateProduit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduit[P]>
      : GetScalarType<T[P], AggregateProduit[P]>
  }




  export type produitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: produitWhereInput
    orderBy?: produitOrderByWithAggregationInput | produitOrderByWithAggregationInput[]
    by: ProduitScalarFieldEnum[] | ProduitScalarFieldEnum
    having?: produitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProduitCountAggregateInputType | true
    _avg?: ProduitAvgAggregateInputType
    _sum?: ProduitSumAggregateInputType
    _min?: ProduitMinAggregateInputType
    _max?: ProduitMaxAggregateInputType
  }

  export type ProduitGroupByOutputType = {
    pro_id: number
    pro_code: string | null
    fk_supplier: number | null
    fk_kit: number | null
    fk_famille: number | null
    fk_sfamille: number | null
    fk_ssfamille: number | null
    created_at: Date | null
    updated_at: Date | null
    _count: ProduitCountAggregateOutputType | null
    _avg: ProduitAvgAggregateOutputType | null
    _sum: ProduitSumAggregateOutputType | null
    _min: ProduitMinAggregateOutputType | null
    _max: ProduitMaxAggregateOutputType | null
  }

  type GetProduitGroupByPayload<T extends produitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProduitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProduitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProduitGroupByOutputType[P]>
            : GetScalarType<T[P], ProduitGroupByOutputType[P]>
        }
      >
    >


  export type produitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    pro_id?: boolean
    pro_code?: boolean
    fk_supplier?: boolean
    fk_kit?: boolean
    fk_famille?: boolean
    fk_sfamille?: boolean
    fk_ssfamille?: boolean
    created_at?: boolean
    updated_at?: boolean
    cross_ref?: boolean | produit$cross_refArgs<ExtArgs>
    kit?: boolean | produit$kitArgs<ExtArgs>
    fournisseur?: boolean | produit$fournisseurArgs<ExtArgs>
    produit_categorie?: boolean | produit$produit_categorieArgs<ExtArgs>
    tarif_achat?: boolean | produit$tarif_achatArgs<ExtArgs>
    _count?: boolean | ProduitCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["produit"]>

  export type produitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    pro_id?: boolean
    pro_code?: boolean
    fk_supplier?: boolean
    fk_kit?: boolean
    fk_famille?: boolean
    fk_sfamille?: boolean
    fk_ssfamille?: boolean
    created_at?: boolean
    updated_at?: boolean
    kit?: boolean | produit$kitArgs<ExtArgs>
    fournisseur?: boolean | produit$fournisseurArgs<ExtArgs>
  }, ExtArgs["result"]["produit"]>

  export type produitSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    pro_id?: boolean
    pro_code?: boolean
    fk_supplier?: boolean
    fk_kit?: boolean
    fk_famille?: boolean
    fk_sfamille?: boolean
    fk_ssfamille?: boolean
    created_at?: boolean
    updated_at?: boolean
    kit?: boolean | produit$kitArgs<ExtArgs>
    fournisseur?: boolean | produit$fournisseurArgs<ExtArgs>
  }, ExtArgs["result"]["produit"]>

  export type produitSelectScalar = {
    pro_id?: boolean
    pro_code?: boolean
    fk_supplier?: boolean
    fk_kit?: boolean
    fk_famille?: boolean
    fk_sfamille?: boolean
    fk_ssfamille?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type produitOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"pro_id" | "pro_code" | "fk_supplier" | "fk_kit" | "fk_famille" | "fk_sfamille" | "fk_ssfamille" | "created_at" | "updated_at", ExtArgs["result"]["produit"]>
  export type produitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cross_ref?: boolean | produit$cross_refArgs<ExtArgs>
    kit?: boolean | produit$kitArgs<ExtArgs>
    fournisseur?: boolean | produit$fournisseurArgs<ExtArgs>
    produit_categorie?: boolean | produit$produit_categorieArgs<ExtArgs>
    tarif_achat?: boolean | produit$tarif_achatArgs<ExtArgs>
    _count?: boolean | ProduitCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type produitIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kit?: boolean | produit$kitArgs<ExtArgs>
    fournisseur?: boolean | produit$fournisseurArgs<ExtArgs>
  }
  export type produitIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kit?: boolean | produit$kitArgs<ExtArgs>
    fournisseur?: boolean | produit$fournisseurArgs<ExtArgs>
  }

  export type $produitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "produit"
    objects: {
      cross_ref: Prisma.$cross_refPayload<ExtArgs>[]
      kit: Prisma.$kit_cenov_dev_ewanPayload<ExtArgs> | null
      fournisseur: Prisma.$fournisseurPayload<ExtArgs> | null
      produit_categorie: Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>[]
      tarif_achat: Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      pro_id: number
      pro_code: string | null
      fk_supplier: number | null
      fk_kit: number | null
      fk_famille: number | null
      fk_sfamille: number | null
      fk_ssfamille: number | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["produit"]>
    composites: {}
  }

  type produitGetPayload<S extends boolean | null | undefined | produitDefaultArgs> = $Result.GetResult<Prisma.$produitPayload, S>

  type produitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<produitFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProduitCountAggregateInputType | true
    }

  export interface produitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['produit'], meta: { name: 'produit' } }
    /**
     * Find zero or one Produit that matches the filter.
     * @param {produitFindUniqueArgs} args - Arguments to find a Produit
     * @example
     * // Get one Produit
     * const produit = await prisma.produit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends produitFindUniqueArgs>(args: SelectSubset<T, produitFindUniqueArgs<ExtArgs>>): Prisma__produitClient<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Produit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {produitFindUniqueOrThrowArgs} args - Arguments to find a Produit
     * @example
     * // Get one Produit
     * const produit = await prisma.produit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends produitFindUniqueOrThrowArgs>(args: SelectSubset<T, produitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__produitClient<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Produit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {produitFindFirstArgs} args - Arguments to find a Produit
     * @example
     * // Get one Produit
     * const produit = await prisma.produit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends produitFindFirstArgs>(args?: SelectSubset<T, produitFindFirstArgs<ExtArgs>>): Prisma__produitClient<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Produit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {produitFindFirstOrThrowArgs} args - Arguments to find a Produit
     * @example
     * // Get one Produit
     * const produit = await prisma.produit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends produitFindFirstOrThrowArgs>(args?: SelectSubset<T, produitFindFirstOrThrowArgs<ExtArgs>>): Prisma__produitClient<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Produits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {produitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Produits
     * const produits = await prisma.produit.findMany()
     * 
     * // Get first 10 Produits
     * const produits = await prisma.produit.findMany({ take: 10 })
     * 
     * // Only select the `pro_id`
     * const produitWithPro_idOnly = await prisma.produit.findMany({ select: { pro_id: true } })
     * 
     */
    findMany<T extends produitFindManyArgs>(args?: SelectSubset<T, produitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Produit.
     * @param {produitCreateArgs} args - Arguments to create a Produit.
     * @example
     * // Create one Produit
     * const Produit = await prisma.produit.create({
     *   data: {
     *     // ... data to create a Produit
     *   }
     * })
     * 
     */
    create<T extends produitCreateArgs>(args: SelectSubset<T, produitCreateArgs<ExtArgs>>): Prisma__produitClient<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Produits.
     * @param {produitCreateManyArgs} args - Arguments to create many Produits.
     * @example
     * // Create many Produits
     * const produit = await prisma.produit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends produitCreateManyArgs>(args?: SelectSubset<T, produitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Produits and returns the data saved in the database.
     * @param {produitCreateManyAndReturnArgs} args - Arguments to create many Produits.
     * @example
     * // Create many Produits
     * const produit = await prisma.produit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Produits and only return the `pro_id`
     * const produitWithPro_idOnly = await prisma.produit.createManyAndReturn({
     *   select: { pro_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends produitCreateManyAndReturnArgs>(args?: SelectSubset<T, produitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Produit.
     * @param {produitDeleteArgs} args - Arguments to delete one Produit.
     * @example
     * // Delete one Produit
     * const Produit = await prisma.produit.delete({
     *   where: {
     *     // ... filter to delete one Produit
     *   }
     * })
     * 
     */
    delete<T extends produitDeleteArgs>(args: SelectSubset<T, produitDeleteArgs<ExtArgs>>): Prisma__produitClient<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Produit.
     * @param {produitUpdateArgs} args - Arguments to update one Produit.
     * @example
     * // Update one Produit
     * const produit = await prisma.produit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends produitUpdateArgs>(args: SelectSubset<T, produitUpdateArgs<ExtArgs>>): Prisma__produitClient<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Produits.
     * @param {produitDeleteManyArgs} args - Arguments to filter Produits to delete.
     * @example
     * // Delete a few Produits
     * const { count } = await prisma.produit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends produitDeleteManyArgs>(args?: SelectSubset<T, produitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Produits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {produitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Produits
     * const produit = await prisma.produit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends produitUpdateManyArgs>(args: SelectSubset<T, produitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Produits and returns the data updated in the database.
     * @param {produitUpdateManyAndReturnArgs} args - Arguments to update many Produits.
     * @example
     * // Update many Produits
     * const produit = await prisma.produit.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Produits and only return the `pro_id`
     * const produitWithPro_idOnly = await prisma.produit.updateManyAndReturn({
     *   select: { pro_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends produitUpdateManyAndReturnArgs>(args: SelectSubset<T, produitUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Produit.
     * @param {produitUpsertArgs} args - Arguments to update or create a Produit.
     * @example
     * // Update or create a Produit
     * const produit = await prisma.produit.upsert({
     *   create: {
     *     // ... data to create a Produit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Produit we want to update
     *   }
     * })
     */
    upsert<T extends produitUpsertArgs>(args: SelectSubset<T, produitUpsertArgs<ExtArgs>>): Prisma__produitClient<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Produits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {produitCountArgs} args - Arguments to filter Produits to count.
     * @example
     * // Count the number of Produits
     * const count = await prisma.produit.count({
     *   where: {
     *     // ... the filter for the Produits we want to count
     *   }
     * })
    **/
    count<T extends produitCountArgs>(
      args?: Subset<T, produitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProduitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Produit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProduitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProduitAggregateArgs>(args: Subset<T, ProduitAggregateArgs>): Prisma.PrismaPromise<GetProduitAggregateType<T>>

    /**
     * Group by Produit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {produitGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends produitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: produitGroupByArgs['orderBy'] }
        : { orderBy?: produitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, produitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProduitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the produit model
   */
  readonly fields: produitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for produit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__produitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cross_ref<T extends produit$cross_refArgs<ExtArgs> = {}>(args?: Subset<T, produit$cross_refArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$cross_refPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    kit<T extends produit$kitArgs<ExtArgs> = {}>(args?: Subset<T, produit$kitArgs<ExtArgs>>): Prisma__kit_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    fournisseur<T extends produit$fournisseurArgs<ExtArgs> = {}>(args?: Subset<T, produit$fournisseurArgs<ExtArgs>>): Prisma__fournisseurClient<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    produit_categorie<T extends produit$produit_categorieArgs<ExtArgs> = {}>(args?: Subset<T, produit$produit_categorieArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tarif_achat<T extends produit$tarif_achatArgs<ExtArgs> = {}>(args?: Subset<T, produit$tarif_achatArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the produit model
   */
  interface produitFieldRefs {
    readonly pro_id: FieldRef<"produit", 'Int'>
    readonly pro_code: FieldRef<"produit", 'String'>
    readonly fk_supplier: FieldRef<"produit", 'Int'>
    readonly fk_kit: FieldRef<"produit", 'Int'>
    readonly fk_famille: FieldRef<"produit", 'Int'>
    readonly fk_sfamille: FieldRef<"produit", 'Int'>
    readonly fk_ssfamille: FieldRef<"produit", 'Int'>
    readonly created_at: FieldRef<"produit", 'DateTime'>
    readonly updated_at: FieldRef<"produit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * produit findUnique
   */
  export type produitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitInclude<ExtArgs> | null
    /**
     * Filter, which produit to fetch.
     */
    where: produitWhereUniqueInput
  }

  /**
   * produit findUniqueOrThrow
   */
  export type produitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitInclude<ExtArgs> | null
    /**
     * Filter, which produit to fetch.
     */
    where: produitWhereUniqueInput
  }

  /**
   * produit findFirst
   */
  export type produitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitInclude<ExtArgs> | null
    /**
     * Filter, which produit to fetch.
     */
    where?: produitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of produits to fetch.
     */
    orderBy?: produitOrderByWithRelationInput | produitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for produits.
     */
    cursor?: produitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` produits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` produits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of produits.
     */
    distinct?: ProduitScalarFieldEnum | ProduitScalarFieldEnum[]
  }

  /**
   * produit findFirstOrThrow
   */
  export type produitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitInclude<ExtArgs> | null
    /**
     * Filter, which produit to fetch.
     */
    where?: produitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of produits to fetch.
     */
    orderBy?: produitOrderByWithRelationInput | produitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for produits.
     */
    cursor?: produitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` produits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` produits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of produits.
     */
    distinct?: ProduitScalarFieldEnum | ProduitScalarFieldEnum[]
  }

  /**
   * produit findMany
   */
  export type produitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitInclude<ExtArgs> | null
    /**
     * Filter, which produits to fetch.
     */
    where?: produitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of produits to fetch.
     */
    orderBy?: produitOrderByWithRelationInput | produitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing produits.
     */
    cursor?: produitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` produits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` produits.
     */
    skip?: number
    distinct?: ProduitScalarFieldEnum | ProduitScalarFieldEnum[]
  }

  /**
   * produit create
   */
  export type produitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitInclude<ExtArgs> | null
    /**
     * The data needed to create a produit.
     */
    data?: XOR<produitCreateInput, produitUncheckedCreateInput>
  }

  /**
   * produit createMany
   */
  export type produitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many produits.
     */
    data: produitCreateManyInput | produitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * produit createManyAndReturn
   */
  export type produitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * The data used to create many produits.
     */
    data: produitCreateManyInput | produitCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * produit update
   */
  export type produitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitInclude<ExtArgs> | null
    /**
     * The data needed to update a produit.
     */
    data: XOR<produitUpdateInput, produitUncheckedUpdateInput>
    /**
     * Choose, which produit to update.
     */
    where: produitWhereUniqueInput
  }

  /**
   * produit updateMany
   */
  export type produitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update produits.
     */
    data: XOR<produitUpdateManyMutationInput, produitUncheckedUpdateManyInput>
    /**
     * Filter which produits to update
     */
    where?: produitWhereInput
    /**
     * Limit how many produits to update.
     */
    limit?: number
  }

  /**
   * produit updateManyAndReturn
   */
  export type produitUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * The data used to update produits.
     */
    data: XOR<produitUpdateManyMutationInput, produitUncheckedUpdateManyInput>
    /**
     * Filter which produits to update
     */
    where?: produitWhereInput
    /**
     * Limit how many produits to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * produit upsert
   */
  export type produitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitInclude<ExtArgs> | null
    /**
     * The filter to search for the produit to update in case it exists.
     */
    where: produitWhereUniqueInput
    /**
     * In case the produit found by the `where` argument doesn't exist, create a new produit with this data.
     */
    create: XOR<produitCreateInput, produitUncheckedCreateInput>
    /**
     * In case the produit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<produitUpdateInput, produitUncheckedUpdateInput>
  }

  /**
   * produit delete
   */
  export type produitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitInclude<ExtArgs> | null
    /**
     * Filter which produit to delete.
     */
    where: produitWhereUniqueInput
  }

  /**
   * produit deleteMany
   */
  export type produitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which produits to delete
     */
    where?: produitWhereInput
    /**
     * Limit how many produits to delete.
     */
    limit?: number
  }

  /**
   * produit.cross_ref
   */
  export type produit$cross_refArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the cross_ref
     */
    select?: cross_refSelect<ExtArgs> | null
    /**
     * Omit specific fields from the cross_ref
     */
    omit?: cross_refOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: cross_refInclude<ExtArgs> | null
    where?: cross_refWhereInput
    orderBy?: cross_refOrderByWithRelationInput | cross_refOrderByWithRelationInput[]
    cursor?: cross_refWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Cross_refScalarFieldEnum | Cross_refScalarFieldEnum[]
  }

  /**
   * produit.kit
   */
  export type produit$kitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
    where?: kit_cenov_dev_ewanWhereInput
  }

  /**
   * produit.fournisseur
   */
  export type produit$fournisseurArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: fournisseurInclude<ExtArgs> | null
    where?: fournisseurWhereInput
  }

  /**
   * produit.produit_categorie
   */
  export type produit$produit_categorieArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanInclude<ExtArgs> | null
    where?: produit_categorie_cenov_dev_ewanWhereInput
    orderBy?: produit_categorie_cenov_dev_ewanOrderByWithRelationInput | produit_categorie_cenov_dev_ewanOrderByWithRelationInput[]
    cursor?: produit_categorie_cenov_dev_ewanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Produit_categorie_cenov_dev_ewanScalarFieldEnum | Produit_categorie_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * produit.tarif_achat
   */
  export type produit$tarif_achatArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanInclude<ExtArgs> | null
    where?: tarif_achat_cenov_dev_ewanWhereInput
    orderBy?: tarif_achat_cenov_dev_ewanOrderByWithRelationInput | tarif_achat_cenov_dev_ewanOrderByWithRelationInput[]
    cursor?: tarif_achat_cenov_dev_ewanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Tarif_achat_cenov_dev_ewanScalarFieldEnum | Tarif_achat_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * produit without action
   */
  export type produitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitInclude<ExtArgs> | null
  }


  /**
   * Model produit_categorie_cenov_dev_ewan
   */

  export type AggregateProduit_categorie_cenov_dev_ewan = {
    _count: Produit_categorie_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Produit_categorie_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Produit_categorie_cenov_dev_ewanSumAggregateOutputType | null
    _min: Produit_categorie_cenov_dev_ewanMinAggregateOutputType | null
    _max: Produit_categorie_cenov_dev_ewanMaxAggregateOutputType | null
  }

  export type Produit_categorie_cenov_dev_ewanAvgAggregateOutputType = {
    fk_produit: number | null
    fk_categorie: number | null
  }

  export type Produit_categorie_cenov_dev_ewanSumAggregateOutputType = {
    fk_produit: number | null
    fk_categorie: number | null
  }

  export type Produit_categorie_cenov_dev_ewanMinAggregateOutputType = {
    fk_produit: number | null
    fk_categorie: number | null
  }

  export type Produit_categorie_cenov_dev_ewanMaxAggregateOutputType = {
    fk_produit: number | null
    fk_categorie: number | null
  }

  export type Produit_categorie_cenov_dev_ewanCountAggregateOutputType = {
    fk_produit: number
    fk_categorie: number
    _all: number
  }


  export type Produit_categorie_cenov_dev_ewanAvgAggregateInputType = {
    fk_produit?: true
    fk_categorie?: true
  }

  export type Produit_categorie_cenov_dev_ewanSumAggregateInputType = {
    fk_produit?: true
    fk_categorie?: true
  }

  export type Produit_categorie_cenov_dev_ewanMinAggregateInputType = {
    fk_produit?: true
    fk_categorie?: true
  }

  export type Produit_categorie_cenov_dev_ewanMaxAggregateInputType = {
    fk_produit?: true
    fk_categorie?: true
  }

  export type Produit_categorie_cenov_dev_ewanCountAggregateInputType = {
    fk_produit?: true
    fk_categorie?: true
    _all?: true
  }

  export type Produit_categorie_cenov_dev_ewanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which produit_categorie_cenov_dev_ewan to aggregate.
     */
    where?: produit_categorie_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of produit_categorie_cenov_dev_ewans to fetch.
     */
    orderBy?: produit_categorie_cenov_dev_ewanOrderByWithRelationInput | produit_categorie_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: produit_categorie_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` produit_categorie_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` produit_categorie_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned produit_categorie_cenov_dev_ewans
    **/
    _count?: true | Produit_categorie_cenov_dev_ewanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Produit_categorie_cenov_dev_ewanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Produit_categorie_cenov_dev_ewanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Produit_categorie_cenov_dev_ewanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Produit_categorie_cenov_dev_ewanMaxAggregateInputType
  }

  export type GetProduit_categorie_cenov_dev_ewanAggregateType<T extends Produit_categorie_cenov_dev_ewanAggregateArgs> = {
        [P in keyof T & keyof AggregateProduit_categorie_cenov_dev_ewan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProduit_categorie_cenov_dev_ewan[P]>
      : GetScalarType<T[P], AggregateProduit_categorie_cenov_dev_ewan[P]>
  }




  export type produit_categorie_cenov_dev_ewanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: produit_categorie_cenov_dev_ewanWhereInput
    orderBy?: produit_categorie_cenov_dev_ewanOrderByWithAggregationInput | produit_categorie_cenov_dev_ewanOrderByWithAggregationInput[]
    by: Produit_categorie_cenov_dev_ewanScalarFieldEnum[] | Produit_categorie_cenov_dev_ewanScalarFieldEnum
    having?: produit_categorie_cenov_dev_ewanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Produit_categorie_cenov_dev_ewanCountAggregateInputType | true
    _avg?: Produit_categorie_cenov_dev_ewanAvgAggregateInputType
    _sum?: Produit_categorie_cenov_dev_ewanSumAggregateInputType
    _min?: Produit_categorie_cenov_dev_ewanMinAggregateInputType
    _max?: Produit_categorie_cenov_dev_ewanMaxAggregateInputType
  }

  export type Produit_categorie_cenov_dev_ewanGroupByOutputType = {
    fk_produit: number
    fk_categorie: number
    _count: Produit_categorie_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Produit_categorie_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Produit_categorie_cenov_dev_ewanSumAggregateOutputType | null
    _min: Produit_categorie_cenov_dev_ewanMinAggregateOutputType | null
    _max: Produit_categorie_cenov_dev_ewanMaxAggregateOutputType | null
  }

  type GetProduit_categorie_cenov_dev_ewanGroupByPayload<T extends produit_categorie_cenov_dev_ewanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Produit_categorie_cenov_dev_ewanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Produit_categorie_cenov_dev_ewanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Produit_categorie_cenov_dev_ewanGroupByOutputType[P]>
            : GetScalarType<T[P], Produit_categorie_cenov_dev_ewanGroupByOutputType[P]>
        }
      >
    >


  export type produit_categorie_cenov_dev_ewanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fk_produit?: boolean
    fk_categorie?: boolean
    categorie?: boolean | categorieDefaultArgs<ExtArgs>
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["produit_categorie_cenov_dev_ewan"]>

  export type produit_categorie_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fk_produit?: boolean
    fk_categorie?: boolean
    categorie?: boolean | categorieDefaultArgs<ExtArgs>
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["produit_categorie_cenov_dev_ewan"]>

  export type produit_categorie_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fk_produit?: boolean
    fk_categorie?: boolean
    categorie?: boolean | categorieDefaultArgs<ExtArgs>
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["produit_categorie_cenov_dev_ewan"]>

  export type produit_categorie_cenov_dev_ewanSelectScalar = {
    fk_produit?: boolean
    fk_categorie?: boolean
  }

  export type produit_categorie_cenov_dev_ewanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"fk_produit" | "fk_categorie", ExtArgs["result"]["produit_categorie_cenov_dev_ewan"]>
  export type produit_categorie_cenov_dev_ewanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categorie?: boolean | categorieDefaultArgs<ExtArgs>
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }
  export type produit_categorie_cenov_dev_ewanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categorie?: boolean | categorieDefaultArgs<ExtArgs>
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }
  export type produit_categorie_cenov_dev_ewanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categorie?: boolean | categorieDefaultArgs<ExtArgs>
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }

  export type $produit_categorie_cenov_dev_ewanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "produit_categorie_cenov_dev_ewan"
    objects: {
      categorie: Prisma.$categoriePayload<ExtArgs>
      produit: Prisma.$produitPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      fk_produit: number
      fk_categorie: number
    }, ExtArgs["result"]["produit_categorie_cenov_dev_ewan"]>
    composites: {}
  }

  type produit_categorie_cenov_dev_ewanGetPayload<S extends boolean | null | undefined | produit_categorie_cenov_dev_ewanDefaultArgs> = $Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload, S>

  type produit_categorie_cenov_dev_ewanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<produit_categorie_cenov_dev_ewanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Produit_categorie_cenov_dev_ewanCountAggregateInputType | true
    }

  export interface produit_categorie_cenov_dev_ewanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['produit_categorie_cenov_dev_ewan'], meta: { name: 'produit_categorie_cenov_dev_ewan' } }
    /**
     * Find zero or one Produit_categorie_cenov_dev_ewan that matches the filter.
     * @param {produit_categorie_cenov_dev_ewanFindUniqueArgs} args - Arguments to find a Produit_categorie_cenov_dev_ewan
     * @example
     * // Get one Produit_categorie_cenov_dev_ewan
     * const produit_categorie_cenov_dev_ewan = await prisma.produit_categorie_cenov_dev_ewan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends produit_categorie_cenov_dev_ewanFindUniqueArgs>(args: SelectSubset<T, produit_categorie_cenov_dev_ewanFindUniqueArgs<ExtArgs>>): Prisma__produit_categorie_cenov_dev_ewanClient<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Produit_categorie_cenov_dev_ewan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {produit_categorie_cenov_dev_ewanFindUniqueOrThrowArgs} args - Arguments to find a Produit_categorie_cenov_dev_ewan
     * @example
     * // Get one Produit_categorie_cenov_dev_ewan
     * const produit_categorie_cenov_dev_ewan = await prisma.produit_categorie_cenov_dev_ewan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends produit_categorie_cenov_dev_ewanFindUniqueOrThrowArgs>(args: SelectSubset<T, produit_categorie_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__produit_categorie_cenov_dev_ewanClient<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Produit_categorie_cenov_dev_ewan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {produit_categorie_cenov_dev_ewanFindFirstArgs} args - Arguments to find a Produit_categorie_cenov_dev_ewan
     * @example
     * // Get one Produit_categorie_cenov_dev_ewan
     * const produit_categorie_cenov_dev_ewan = await prisma.produit_categorie_cenov_dev_ewan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends produit_categorie_cenov_dev_ewanFindFirstArgs>(args?: SelectSubset<T, produit_categorie_cenov_dev_ewanFindFirstArgs<ExtArgs>>): Prisma__produit_categorie_cenov_dev_ewanClient<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Produit_categorie_cenov_dev_ewan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {produit_categorie_cenov_dev_ewanFindFirstOrThrowArgs} args - Arguments to find a Produit_categorie_cenov_dev_ewan
     * @example
     * // Get one Produit_categorie_cenov_dev_ewan
     * const produit_categorie_cenov_dev_ewan = await prisma.produit_categorie_cenov_dev_ewan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends produit_categorie_cenov_dev_ewanFindFirstOrThrowArgs>(args?: SelectSubset<T, produit_categorie_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>>): Prisma__produit_categorie_cenov_dev_ewanClient<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Produit_categorie_cenov_dev_ewans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {produit_categorie_cenov_dev_ewanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Produit_categorie_cenov_dev_ewans
     * const produit_categorie_cenov_dev_ewans = await prisma.produit_categorie_cenov_dev_ewan.findMany()
     * 
     * // Get first 10 Produit_categorie_cenov_dev_ewans
     * const produit_categorie_cenov_dev_ewans = await prisma.produit_categorie_cenov_dev_ewan.findMany({ take: 10 })
     * 
     * // Only select the `fk_produit`
     * const produit_categorie_cenov_dev_ewanWithFk_produitOnly = await prisma.produit_categorie_cenov_dev_ewan.findMany({ select: { fk_produit: true } })
     * 
     */
    findMany<T extends produit_categorie_cenov_dev_ewanFindManyArgs>(args?: SelectSubset<T, produit_categorie_cenov_dev_ewanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Produit_categorie_cenov_dev_ewan.
     * @param {produit_categorie_cenov_dev_ewanCreateArgs} args - Arguments to create a Produit_categorie_cenov_dev_ewan.
     * @example
     * // Create one Produit_categorie_cenov_dev_ewan
     * const Produit_categorie_cenov_dev_ewan = await prisma.produit_categorie_cenov_dev_ewan.create({
     *   data: {
     *     // ... data to create a Produit_categorie_cenov_dev_ewan
     *   }
     * })
     * 
     */
    create<T extends produit_categorie_cenov_dev_ewanCreateArgs>(args: SelectSubset<T, produit_categorie_cenov_dev_ewanCreateArgs<ExtArgs>>): Prisma__produit_categorie_cenov_dev_ewanClient<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Produit_categorie_cenov_dev_ewans.
     * @param {produit_categorie_cenov_dev_ewanCreateManyArgs} args - Arguments to create many Produit_categorie_cenov_dev_ewans.
     * @example
     * // Create many Produit_categorie_cenov_dev_ewans
     * const produit_categorie_cenov_dev_ewan = await prisma.produit_categorie_cenov_dev_ewan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends produit_categorie_cenov_dev_ewanCreateManyArgs>(args?: SelectSubset<T, produit_categorie_cenov_dev_ewanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Produit_categorie_cenov_dev_ewans and returns the data saved in the database.
     * @param {produit_categorie_cenov_dev_ewanCreateManyAndReturnArgs} args - Arguments to create many Produit_categorie_cenov_dev_ewans.
     * @example
     * // Create many Produit_categorie_cenov_dev_ewans
     * const produit_categorie_cenov_dev_ewan = await prisma.produit_categorie_cenov_dev_ewan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Produit_categorie_cenov_dev_ewans and only return the `fk_produit`
     * const produit_categorie_cenov_dev_ewanWithFk_produitOnly = await prisma.produit_categorie_cenov_dev_ewan.createManyAndReturn({
     *   select: { fk_produit: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends produit_categorie_cenov_dev_ewanCreateManyAndReturnArgs>(args?: SelectSubset<T, produit_categorie_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Produit_categorie_cenov_dev_ewan.
     * @param {produit_categorie_cenov_dev_ewanDeleteArgs} args - Arguments to delete one Produit_categorie_cenov_dev_ewan.
     * @example
     * // Delete one Produit_categorie_cenov_dev_ewan
     * const Produit_categorie_cenov_dev_ewan = await prisma.produit_categorie_cenov_dev_ewan.delete({
     *   where: {
     *     // ... filter to delete one Produit_categorie_cenov_dev_ewan
     *   }
     * })
     * 
     */
    delete<T extends produit_categorie_cenov_dev_ewanDeleteArgs>(args: SelectSubset<T, produit_categorie_cenov_dev_ewanDeleteArgs<ExtArgs>>): Prisma__produit_categorie_cenov_dev_ewanClient<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Produit_categorie_cenov_dev_ewan.
     * @param {produit_categorie_cenov_dev_ewanUpdateArgs} args - Arguments to update one Produit_categorie_cenov_dev_ewan.
     * @example
     * // Update one Produit_categorie_cenov_dev_ewan
     * const produit_categorie_cenov_dev_ewan = await prisma.produit_categorie_cenov_dev_ewan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends produit_categorie_cenov_dev_ewanUpdateArgs>(args: SelectSubset<T, produit_categorie_cenov_dev_ewanUpdateArgs<ExtArgs>>): Prisma__produit_categorie_cenov_dev_ewanClient<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Produit_categorie_cenov_dev_ewans.
     * @param {produit_categorie_cenov_dev_ewanDeleteManyArgs} args - Arguments to filter Produit_categorie_cenov_dev_ewans to delete.
     * @example
     * // Delete a few Produit_categorie_cenov_dev_ewans
     * const { count } = await prisma.produit_categorie_cenov_dev_ewan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends produit_categorie_cenov_dev_ewanDeleteManyArgs>(args?: SelectSubset<T, produit_categorie_cenov_dev_ewanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Produit_categorie_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {produit_categorie_cenov_dev_ewanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Produit_categorie_cenov_dev_ewans
     * const produit_categorie_cenov_dev_ewan = await prisma.produit_categorie_cenov_dev_ewan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends produit_categorie_cenov_dev_ewanUpdateManyArgs>(args: SelectSubset<T, produit_categorie_cenov_dev_ewanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Produit_categorie_cenov_dev_ewans and returns the data updated in the database.
     * @param {produit_categorie_cenov_dev_ewanUpdateManyAndReturnArgs} args - Arguments to update many Produit_categorie_cenov_dev_ewans.
     * @example
     * // Update many Produit_categorie_cenov_dev_ewans
     * const produit_categorie_cenov_dev_ewan = await prisma.produit_categorie_cenov_dev_ewan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Produit_categorie_cenov_dev_ewans and only return the `fk_produit`
     * const produit_categorie_cenov_dev_ewanWithFk_produitOnly = await prisma.produit_categorie_cenov_dev_ewan.updateManyAndReturn({
     *   select: { fk_produit: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends produit_categorie_cenov_dev_ewanUpdateManyAndReturnArgs>(args: SelectSubset<T, produit_categorie_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Produit_categorie_cenov_dev_ewan.
     * @param {produit_categorie_cenov_dev_ewanUpsertArgs} args - Arguments to update or create a Produit_categorie_cenov_dev_ewan.
     * @example
     * // Update or create a Produit_categorie_cenov_dev_ewan
     * const produit_categorie_cenov_dev_ewan = await prisma.produit_categorie_cenov_dev_ewan.upsert({
     *   create: {
     *     // ... data to create a Produit_categorie_cenov_dev_ewan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Produit_categorie_cenov_dev_ewan we want to update
     *   }
     * })
     */
    upsert<T extends produit_categorie_cenov_dev_ewanUpsertArgs>(args: SelectSubset<T, produit_categorie_cenov_dev_ewanUpsertArgs<ExtArgs>>): Prisma__produit_categorie_cenov_dev_ewanClient<$Result.GetResult<Prisma.$produit_categorie_cenov_dev_ewanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Produit_categorie_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {produit_categorie_cenov_dev_ewanCountArgs} args - Arguments to filter Produit_categorie_cenov_dev_ewans to count.
     * @example
     * // Count the number of Produit_categorie_cenov_dev_ewans
     * const count = await prisma.produit_categorie_cenov_dev_ewan.count({
     *   where: {
     *     // ... the filter for the Produit_categorie_cenov_dev_ewans we want to count
     *   }
     * })
    **/
    count<T extends produit_categorie_cenov_dev_ewanCountArgs>(
      args?: Subset<T, produit_categorie_cenov_dev_ewanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Produit_categorie_cenov_dev_ewanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Produit_categorie_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Produit_categorie_cenov_dev_ewanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Produit_categorie_cenov_dev_ewanAggregateArgs>(args: Subset<T, Produit_categorie_cenov_dev_ewanAggregateArgs>): Prisma.PrismaPromise<GetProduit_categorie_cenov_dev_ewanAggregateType<T>>

    /**
     * Group by Produit_categorie_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {produit_categorie_cenov_dev_ewanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends produit_categorie_cenov_dev_ewanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: produit_categorie_cenov_dev_ewanGroupByArgs['orderBy'] }
        : { orderBy?: produit_categorie_cenov_dev_ewanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, produit_categorie_cenov_dev_ewanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProduit_categorie_cenov_dev_ewanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the produit_categorie_cenov_dev_ewan model
   */
  readonly fields: produit_categorie_cenov_dev_ewanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for produit_categorie_cenov_dev_ewan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__produit_categorie_cenov_dev_ewanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    categorie<T extends categorieDefaultArgs<ExtArgs> = {}>(args?: Subset<T, categorieDefaultArgs<ExtArgs>>): Prisma__categorieClient<$Result.GetResult<Prisma.$categoriePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    produit<T extends produitDefaultArgs<ExtArgs> = {}>(args?: Subset<T, produitDefaultArgs<ExtArgs>>): Prisma__produitClient<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the produit_categorie_cenov_dev_ewan model
   */
  interface produit_categorie_cenov_dev_ewanFieldRefs {
    readonly fk_produit: FieldRef<"produit_categorie_cenov_dev_ewan", 'Int'>
    readonly fk_categorie: FieldRef<"produit_categorie_cenov_dev_ewan", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * produit_categorie_cenov_dev_ewan findUnique
   */
  export type produit_categorie_cenov_dev_ewanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which produit_categorie_cenov_dev_ewan to fetch.
     */
    where: produit_categorie_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * produit_categorie_cenov_dev_ewan findUniqueOrThrow
   */
  export type produit_categorie_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which produit_categorie_cenov_dev_ewan to fetch.
     */
    where: produit_categorie_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * produit_categorie_cenov_dev_ewan findFirst
   */
  export type produit_categorie_cenov_dev_ewanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which produit_categorie_cenov_dev_ewan to fetch.
     */
    where?: produit_categorie_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of produit_categorie_cenov_dev_ewans to fetch.
     */
    orderBy?: produit_categorie_cenov_dev_ewanOrderByWithRelationInput | produit_categorie_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for produit_categorie_cenov_dev_ewans.
     */
    cursor?: produit_categorie_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` produit_categorie_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` produit_categorie_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of produit_categorie_cenov_dev_ewans.
     */
    distinct?: Produit_categorie_cenov_dev_ewanScalarFieldEnum | Produit_categorie_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * produit_categorie_cenov_dev_ewan findFirstOrThrow
   */
  export type produit_categorie_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which produit_categorie_cenov_dev_ewan to fetch.
     */
    where?: produit_categorie_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of produit_categorie_cenov_dev_ewans to fetch.
     */
    orderBy?: produit_categorie_cenov_dev_ewanOrderByWithRelationInput | produit_categorie_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for produit_categorie_cenov_dev_ewans.
     */
    cursor?: produit_categorie_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` produit_categorie_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` produit_categorie_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of produit_categorie_cenov_dev_ewans.
     */
    distinct?: Produit_categorie_cenov_dev_ewanScalarFieldEnum | Produit_categorie_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * produit_categorie_cenov_dev_ewan findMany
   */
  export type produit_categorie_cenov_dev_ewanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which produit_categorie_cenov_dev_ewans to fetch.
     */
    where?: produit_categorie_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of produit_categorie_cenov_dev_ewans to fetch.
     */
    orderBy?: produit_categorie_cenov_dev_ewanOrderByWithRelationInput | produit_categorie_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing produit_categorie_cenov_dev_ewans.
     */
    cursor?: produit_categorie_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` produit_categorie_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` produit_categorie_cenov_dev_ewans.
     */
    skip?: number
    distinct?: Produit_categorie_cenov_dev_ewanScalarFieldEnum | Produit_categorie_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * produit_categorie_cenov_dev_ewan create
   */
  export type produit_categorie_cenov_dev_ewanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to create a produit_categorie_cenov_dev_ewan.
     */
    data: XOR<produit_categorie_cenov_dev_ewanCreateInput, produit_categorie_cenov_dev_ewanUncheckedCreateInput>
  }

  /**
   * produit_categorie_cenov_dev_ewan createMany
   */
  export type produit_categorie_cenov_dev_ewanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many produit_categorie_cenov_dev_ewans.
     */
    data: produit_categorie_cenov_dev_ewanCreateManyInput | produit_categorie_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * produit_categorie_cenov_dev_ewan createManyAndReturn
   */
  export type produit_categorie_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to create many produit_categorie_cenov_dev_ewans.
     */
    data: produit_categorie_cenov_dev_ewanCreateManyInput | produit_categorie_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * produit_categorie_cenov_dev_ewan update
   */
  export type produit_categorie_cenov_dev_ewanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to update a produit_categorie_cenov_dev_ewan.
     */
    data: XOR<produit_categorie_cenov_dev_ewanUpdateInput, produit_categorie_cenov_dev_ewanUncheckedUpdateInput>
    /**
     * Choose, which produit_categorie_cenov_dev_ewan to update.
     */
    where: produit_categorie_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * produit_categorie_cenov_dev_ewan updateMany
   */
  export type produit_categorie_cenov_dev_ewanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update produit_categorie_cenov_dev_ewans.
     */
    data: XOR<produit_categorie_cenov_dev_ewanUpdateManyMutationInput, produit_categorie_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which produit_categorie_cenov_dev_ewans to update
     */
    where?: produit_categorie_cenov_dev_ewanWhereInput
    /**
     * Limit how many produit_categorie_cenov_dev_ewans to update.
     */
    limit?: number
  }

  /**
   * produit_categorie_cenov_dev_ewan updateManyAndReturn
   */
  export type produit_categorie_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to update produit_categorie_cenov_dev_ewans.
     */
    data: XOR<produit_categorie_cenov_dev_ewanUpdateManyMutationInput, produit_categorie_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which produit_categorie_cenov_dev_ewans to update
     */
    where?: produit_categorie_cenov_dev_ewanWhereInput
    /**
     * Limit how many produit_categorie_cenov_dev_ewans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * produit_categorie_cenov_dev_ewan upsert
   */
  export type produit_categorie_cenov_dev_ewanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The filter to search for the produit_categorie_cenov_dev_ewan to update in case it exists.
     */
    where: produit_categorie_cenov_dev_ewanWhereUniqueInput
    /**
     * In case the produit_categorie_cenov_dev_ewan found by the `where` argument doesn't exist, create a new produit_categorie_cenov_dev_ewan with this data.
     */
    create: XOR<produit_categorie_cenov_dev_ewanCreateInput, produit_categorie_cenov_dev_ewanUncheckedCreateInput>
    /**
     * In case the produit_categorie_cenov_dev_ewan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<produit_categorie_cenov_dev_ewanUpdateInput, produit_categorie_cenov_dev_ewanUncheckedUpdateInput>
  }

  /**
   * produit_categorie_cenov_dev_ewan delete
   */
  export type produit_categorie_cenov_dev_ewanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter which produit_categorie_cenov_dev_ewan to delete.
     */
    where: produit_categorie_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * produit_categorie_cenov_dev_ewan deleteMany
   */
  export type produit_categorie_cenov_dev_ewanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which produit_categorie_cenov_dev_ewans to delete
     */
    where?: produit_categorie_cenov_dev_ewanWhereInput
    /**
     * Limit how many produit_categorie_cenov_dev_ewans to delete.
     */
    limit?: number
  }

  /**
   * produit_categorie_cenov_dev_ewan without action
   */
  export type produit_categorie_cenov_dev_ewanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit_categorie_cenov_dev_ewan
     */
    select?: produit_categorie_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit_categorie_cenov_dev_ewan
     */
    omit?: produit_categorie_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produit_categorie_cenov_dev_ewanInclude<ExtArgs> | null
  }


  /**
   * Model tarif_achat_cenov_dev_ewan
   */

  export type AggregateTarif_achat_cenov_dev_ewan = {
    _count: Tarif_achat_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Tarif_achat_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Tarif_achat_cenov_dev_ewanSumAggregateOutputType | null
    _min: Tarif_achat_cenov_dev_ewanMinAggregateOutputType | null
    _max: Tarif_achat_cenov_dev_ewanMaxAggregateOutputType | null
  }

  export type Tarif_achat_cenov_dev_ewanAvgAggregateOutputType = {
    fk_produit: number | null
    taa_montant: number | null
    taa_remise: number | null
    taa_montant_net: number | null
  }

  export type Tarif_achat_cenov_dev_ewanSumAggregateOutputType = {
    fk_produit: number | null
    taa_montant: number | null
    taa_remise: number | null
    taa_montant_net: number | null
  }

  export type Tarif_achat_cenov_dev_ewanMinAggregateOutputType = {
    fk_produit: number | null
    taa_date: Date | null
    taa_montant: number | null
    taa_remise: number | null
    taa_montant_net: number | null
  }

  export type Tarif_achat_cenov_dev_ewanMaxAggregateOutputType = {
    fk_produit: number | null
    taa_date: Date | null
    taa_montant: number | null
    taa_remise: number | null
    taa_montant_net: number | null
  }

  export type Tarif_achat_cenov_dev_ewanCountAggregateOutputType = {
    fk_produit: number
    taa_date: number
    taa_montant: number
    taa_remise: number
    taa_montant_net: number
    _all: number
  }


  export type Tarif_achat_cenov_dev_ewanAvgAggregateInputType = {
    fk_produit?: true
    taa_montant?: true
    taa_remise?: true
    taa_montant_net?: true
  }

  export type Tarif_achat_cenov_dev_ewanSumAggregateInputType = {
    fk_produit?: true
    taa_montant?: true
    taa_remise?: true
    taa_montant_net?: true
  }

  export type Tarif_achat_cenov_dev_ewanMinAggregateInputType = {
    fk_produit?: true
    taa_date?: true
    taa_montant?: true
    taa_remise?: true
    taa_montant_net?: true
  }

  export type Tarif_achat_cenov_dev_ewanMaxAggregateInputType = {
    fk_produit?: true
    taa_date?: true
    taa_montant?: true
    taa_remise?: true
    taa_montant_net?: true
  }

  export type Tarif_achat_cenov_dev_ewanCountAggregateInputType = {
    fk_produit?: true
    taa_date?: true
    taa_montant?: true
    taa_remise?: true
    taa_montant_net?: true
    _all?: true
  }

  export type Tarif_achat_cenov_dev_ewanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tarif_achat_cenov_dev_ewan to aggregate.
     */
    where?: tarif_achat_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tarif_achat_cenov_dev_ewans to fetch.
     */
    orderBy?: tarif_achat_cenov_dev_ewanOrderByWithRelationInput | tarif_achat_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: tarif_achat_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tarif_achat_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tarif_achat_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned tarif_achat_cenov_dev_ewans
    **/
    _count?: true | Tarif_achat_cenov_dev_ewanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Tarif_achat_cenov_dev_ewanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Tarif_achat_cenov_dev_ewanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Tarif_achat_cenov_dev_ewanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Tarif_achat_cenov_dev_ewanMaxAggregateInputType
  }

  export type GetTarif_achat_cenov_dev_ewanAggregateType<T extends Tarif_achat_cenov_dev_ewanAggregateArgs> = {
        [P in keyof T & keyof AggregateTarif_achat_cenov_dev_ewan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTarif_achat_cenov_dev_ewan[P]>
      : GetScalarType<T[P], AggregateTarif_achat_cenov_dev_ewan[P]>
  }




  export type tarif_achat_cenov_dev_ewanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: tarif_achat_cenov_dev_ewanWhereInput
    orderBy?: tarif_achat_cenov_dev_ewanOrderByWithAggregationInput | tarif_achat_cenov_dev_ewanOrderByWithAggregationInput[]
    by: Tarif_achat_cenov_dev_ewanScalarFieldEnum[] | Tarif_achat_cenov_dev_ewanScalarFieldEnum
    having?: tarif_achat_cenov_dev_ewanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Tarif_achat_cenov_dev_ewanCountAggregateInputType | true
    _avg?: Tarif_achat_cenov_dev_ewanAvgAggregateInputType
    _sum?: Tarif_achat_cenov_dev_ewanSumAggregateInputType
    _min?: Tarif_achat_cenov_dev_ewanMinAggregateInputType
    _max?: Tarif_achat_cenov_dev_ewanMaxAggregateInputType
  }

  export type Tarif_achat_cenov_dev_ewanGroupByOutputType = {
    fk_produit: number
    taa_date: Date
    taa_montant: number | null
    taa_remise: number | null
    taa_montant_net: number | null
    _count: Tarif_achat_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Tarif_achat_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Tarif_achat_cenov_dev_ewanSumAggregateOutputType | null
    _min: Tarif_achat_cenov_dev_ewanMinAggregateOutputType | null
    _max: Tarif_achat_cenov_dev_ewanMaxAggregateOutputType | null
  }

  type GetTarif_achat_cenov_dev_ewanGroupByPayload<T extends tarif_achat_cenov_dev_ewanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Tarif_achat_cenov_dev_ewanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Tarif_achat_cenov_dev_ewanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Tarif_achat_cenov_dev_ewanGroupByOutputType[P]>
            : GetScalarType<T[P], Tarif_achat_cenov_dev_ewanGroupByOutputType[P]>
        }
      >
    >


  export type tarif_achat_cenov_dev_ewanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fk_produit?: boolean
    taa_date?: boolean
    taa_montant?: boolean
    taa_remise?: boolean
    taa_montant_net?: boolean
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tarif_achat_cenov_dev_ewan"]>

  export type tarif_achat_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fk_produit?: boolean
    taa_date?: boolean
    taa_montant?: boolean
    taa_remise?: boolean
    taa_montant_net?: boolean
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tarif_achat_cenov_dev_ewan"]>

  export type tarif_achat_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fk_produit?: boolean
    taa_date?: boolean
    taa_montant?: boolean
    taa_remise?: boolean
    taa_montant_net?: boolean
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tarif_achat_cenov_dev_ewan"]>

  export type tarif_achat_cenov_dev_ewanSelectScalar = {
    fk_produit?: boolean
    taa_date?: boolean
    taa_montant?: boolean
    taa_remise?: boolean
    taa_montant_net?: boolean
  }

  export type tarif_achat_cenov_dev_ewanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"fk_produit" | "taa_date" | "taa_montant" | "taa_remise" | "taa_montant_net", ExtArgs["result"]["tarif_achat_cenov_dev_ewan"]>
  export type tarif_achat_cenov_dev_ewanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }
  export type tarif_achat_cenov_dev_ewanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }
  export type tarif_achat_cenov_dev_ewanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produit?: boolean | produitDefaultArgs<ExtArgs>
  }

  export type $tarif_achat_cenov_dev_ewanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "tarif_achat_cenov_dev_ewan"
    objects: {
      produit: Prisma.$produitPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      fk_produit: number
      taa_date: Date
      taa_montant: number | null
      taa_remise: number | null
      taa_montant_net: number | null
    }, ExtArgs["result"]["tarif_achat_cenov_dev_ewan"]>
    composites: {}
  }

  type tarif_achat_cenov_dev_ewanGetPayload<S extends boolean | null | undefined | tarif_achat_cenov_dev_ewanDefaultArgs> = $Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload, S>

  type tarif_achat_cenov_dev_ewanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<tarif_achat_cenov_dev_ewanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Tarif_achat_cenov_dev_ewanCountAggregateInputType | true
    }

  export interface tarif_achat_cenov_dev_ewanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['tarif_achat_cenov_dev_ewan'], meta: { name: 'tarif_achat_cenov_dev_ewan' } }
    /**
     * Find zero or one Tarif_achat_cenov_dev_ewan that matches the filter.
     * @param {tarif_achat_cenov_dev_ewanFindUniqueArgs} args - Arguments to find a Tarif_achat_cenov_dev_ewan
     * @example
     * // Get one Tarif_achat_cenov_dev_ewan
     * const tarif_achat_cenov_dev_ewan = await prisma.tarif_achat_cenov_dev_ewan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends tarif_achat_cenov_dev_ewanFindUniqueArgs>(args: SelectSubset<T, tarif_achat_cenov_dev_ewanFindUniqueArgs<ExtArgs>>): Prisma__tarif_achat_cenov_dev_ewanClient<$Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tarif_achat_cenov_dev_ewan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {tarif_achat_cenov_dev_ewanFindUniqueOrThrowArgs} args - Arguments to find a Tarif_achat_cenov_dev_ewan
     * @example
     * // Get one Tarif_achat_cenov_dev_ewan
     * const tarif_achat_cenov_dev_ewan = await prisma.tarif_achat_cenov_dev_ewan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends tarif_achat_cenov_dev_ewanFindUniqueOrThrowArgs>(args: SelectSubset<T, tarif_achat_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__tarif_achat_cenov_dev_ewanClient<$Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tarif_achat_cenov_dev_ewan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tarif_achat_cenov_dev_ewanFindFirstArgs} args - Arguments to find a Tarif_achat_cenov_dev_ewan
     * @example
     * // Get one Tarif_achat_cenov_dev_ewan
     * const tarif_achat_cenov_dev_ewan = await prisma.tarif_achat_cenov_dev_ewan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends tarif_achat_cenov_dev_ewanFindFirstArgs>(args?: SelectSubset<T, tarif_achat_cenov_dev_ewanFindFirstArgs<ExtArgs>>): Prisma__tarif_achat_cenov_dev_ewanClient<$Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tarif_achat_cenov_dev_ewan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tarif_achat_cenov_dev_ewanFindFirstOrThrowArgs} args - Arguments to find a Tarif_achat_cenov_dev_ewan
     * @example
     * // Get one Tarif_achat_cenov_dev_ewan
     * const tarif_achat_cenov_dev_ewan = await prisma.tarif_achat_cenov_dev_ewan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends tarif_achat_cenov_dev_ewanFindFirstOrThrowArgs>(args?: SelectSubset<T, tarif_achat_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>>): Prisma__tarif_achat_cenov_dev_ewanClient<$Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tarif_achat_cenov_dev_ewans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tarif_achat_cenov_dev_ewanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tarif_achat_cenov_dev_ewans
     * const tarif_achat_cenov_dev_ewans = await prisma.tarif_achat_cenov_dev_ewan.findMany()
     * 
     * // Get first 10 Tarif_achat_cenov_dev_ewans
     * const tarif_achat_cenov_dev_ewans = await prisma.tarif_achat_cenov_dev_ewan.findMany({ take: 10 })
     * 
     * // Only select the `fk_produit`
     * const tarif_achat_cenov_dev_ewanWithFk_produitOnly = await prisma.tarif_achat_cenov_dev_ewan.findMany({ select: { fk_produit: true } })
     * 
     */
    findMany<T extends tarif_achat_cenov_dev_ewanFindManyArgs>(args?: SelectSubset<T, tarif_achat_cenov_dev_ewanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tarif_achat_cenov_dev_ewan.
     * @param {tarif_achat_cenov_dev_ewanCreateArgs} args - Arguments to create a Tarif_achat_cenov_dev_ewan.
     * @example
     * // Create one Tarif_achat_cenov_dev_ewan
     * const Tarif_achat_cenov_dev_ewan = await prisma.tarif_achat_cenov_dev_ewan.create({
     *   data: {
     *     // ... data to create a Tarif_achat_cenov_dev_ewan
     *   }
     * })
     * 
     */
    create<T extends tarif_achat_cenov_dev_ewanCreateArgs>(args: SelectSubset<T, tarif_achat_cenov_dev_ewanCreateArgs<ExtArgs>>): Prisma__tarif_achat_cenov_dev_ewanClient<$Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tarif_achat_cenov_dev_ewans.
     * @param {tarif_achat_cenov_dev_ewanCreateManyArgs} args - Arguments to create many Tarif_achat_cenov_dev_ewans.
     * @example
     * // Create many Tarif_achat_cenov_dev_ewans
     * const tarif_achat_cenov_dev_ewan = await prisma.tarif_achat_cenov_dev_ewan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends tarif_achat_cenov_dev_ewanCreateManyArgs>(args?: SelectSubset<T, tarif_achat_cenov_dev_ewanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tarif_achat_cenov_dev_ewans and returns the data saved in the database.
     * @param {tarif_achat_cenov_dev_ewanCreateManyAndReturnArgs} args - Arguments to create many Tarif_achat_cenov_dev_ewans.
     * @example
     * // Create many Tarif_achat_cenov_dev_ewans
     * const tarif_achat_cenov_dev_ewan = await prisma.tarif_achat_cenov_dev_ewan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tarif_achat_cenov_dev_ewans and only return the `fk_produit`
     * const tarif_achat_cenov_dev_ewanWithFk_produitOnly = await prisma.tarif_achat_cenov_dev_ewan.createManyAndReturn({
     *   select: { fk_produit: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends tarif_achat_cenov_dev_ewanCreateManyAndReturnArgs>(args?: SelectSubset<T, tarif_achat_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tarif_achat_cenov_dev_ewan.
     * @param {tarif_achat_cenov_dev_ewanDeleteArgs} args - Arguments to delete one Tarif_achat_cenov_dev_ewan.
     * @example
     * // Delete one Tarif_achat_cenov_dev_ewan
     * const Tarif_achat_cenov_dev_ewan = await prisma.tarif_achat_cenov_dev_ewan.delete({
     *   where: {
     *     // ... filter to delete one Tarif_achat_cenov_dev_ewan
     *   }
     * })
     * 
     */
    delete<T extends tarif_achat_cenov_dev_ewanDeleteArgs>(args: SelectSubset<T, tarif_achat_cenov_dev_ewanDeleteArgs<ExtArgs>>): Prisma__tarif_achat_cenov_dev_ewanClient<$Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tarif_achat_cenov_dev_ewan.
     * @param {tarif_achat_cenov_dev_ewanUpdateArgs} args - Arguments to update one Tarif_achat_cenov_dev_ewan.
     * @example
     * // Update one Tarif_achat_cenov_dev_ewan
     * const tarif_achat_cenov_dev_ewan = await prisma.tarif_achat_cenov_dev_ewan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends tarif_achat_cenov_dev_ewanUpdateArgs>(args: SelectSubset<T, tarif_achat_cenov_dev_ewanUpdateArgs<ExtArgs>>): Prisma__tarif_achat_cenov_dev_ewanClient<$Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tarif_achat_cenov_dev_ewans.
     * @param {tarif_achat_cenov_dev_ewanDeleteManyArgs} args - Arguments to filter Tarif_achat_cenov_dev_ewans to delete.
     * @example
     * // Delete a few Tarif_achat_cenov_dev_ewans
     * const { count } = await prisma.tarif_achat_cenov_dev_ewan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends tarif_achat_cenov_dev_ewanDeleteManyArgs>(args?: SelectSubset<T, tarif_achat_cenov_dev_ewanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tarif_achat_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tarif_achat_cenov_dev_ewanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tarif_achat_cenov_dev_ewans
     * const tarif_achat_cenov_dev_ewan = await prisma.tarif_achat_cenov_dev_ewan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends tarif_achat_cenov_dev_ewanUpdateManyArgs>(args: SelectSubset<T, tarif_achat_cenov_dev_ewanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tarif_achat_cenov_dev_ewans and returns the data updated in the database.
     * @param {tarif_achat_cenov_dev_ewanUpdateManyAndReturnArgs} args - Arguments to update many Tarif_achat_cenov_dev_ewans.
     * @example
     * // Update many Tarif_achat_cenov_dev_ewans
     * const tarif_achat_cenov_dev_ewan = await prisma.tarif_achat_cenov_dev_ewan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tarif_achat_cenov_dev_ewans and only return the `fk_produit`
     * const tarif_achat_cenov_dev_ewanWithFk_produitOnly = await prisma.tarif_achat_cenov_dev_ewan.updateManyAndReturn({
     *   select: { fk_produit: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends tarif_achat_cenov_dev_ewanUpdateManyAndReturnArgs>(args: SelectSubset<T, tarif_achat_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tarif_achat_cenov_dev_ewan.
     * @param {tarif_achat_cenov_dev_ewanUpsertArgs} args - Arguments to update or create a Tarif_achat_cenov_dev_ewan.
     * @example
     * // Update or create a Tarif_achat_cenov_dev_ewan
     * const tarif_achat_cenov_dev_ewan = await prisma.tarif_achat_cenov_dev_ewan.upsert({
     *   create: {
     *     // ... data to create a Tarif_achat_cenov_dev_ewan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tarif_achat_cenov_dev_ewan we want to update
     *   }
     * })
     */
    upsert<T extends tarif_achat_cenov_dev_ewanUpsertArgs>(args: SelectSubset<T, tarif_achat_cenov_dev_ewanUpsertArgs<ExtArgs>>): Prisma__tarif_achat_cenov_dev_ewanClient<$Result.GetResult<Prisma.$tarif_achat_cenov_dev_ewanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tarif_achat_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tarif_achat_cenov_dev_ewanCountArgs} args - Arguments to filter Tarif_achat_cenov_dev_ewans to count.
     * @example
     * // Count the number of Tarif_achat_cenov_dev_ewans
     * const count = await prisma.tarif_achat_cenov_dev_ewan.count({
     *   where: {
     *     // ... the filter for the Tarif_achat_cenov_dev_ewans we want to count
     *   }
     * })
    **/
    count<T extends tarif_achat_cenov_dev_ewanCountArgs>(
      args?: Subset<T, tarif_achat_cenov_dev_ewanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Tarif_achat_cenov_dev_ewanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tarif_achat_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Tarif_achat_cenov_dev_ewanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Tarif_achat_cenov_dev_ewanAggregateArgs>(args: Subset<T, Tarif_achat_cenov_dev_ewanAggregateArgs>): Prisma.PrismaPromise<GetTarif_achat_cenov_dev_ewanAggregateType<T>>

    /**
     * Group by Tarif_achat_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {tarif_achat_cenov_dev_ewanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends tarif_achat_cenov_dev_ewanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: tarif_achat_cenov_dev_ewanGroupByArgs['orderBy'] }
        : { orderBy?: tarif_achat_cenov_dev_ewanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, tarif_achat_cenov_dev_ewanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTarif_achat_cenov_dev_ewanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the tarif_achat_cenov_dev_ewan model
   */
  readonly fields: tarif_achat_cenov_dev_ewanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for tarif_achat_cenov_dev_ewan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__tarif_achat_cenov_dev_ewanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    produit<T extends produitDefaultArgs<ExtArgs> = {}>(args?: Subset<T, produitDefaultArgs<ExtArgs>>): Prisma__produitClient<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the tarif_achat_cenov_dev_ewan model
   */
  interface tarif_achat_cenov_dev_ewanFieldRefs {
    readonly fk_produit: FieldRef<"tarif_achat_cenov_dev_ewan", 'Int'>
    readonly taa_date: FieldRef<"tarif_achat_cenov_dev_ewan", 'DateTime'>
    readonly taa_montant: FieldRef<"tarif_achat_cenov_dev_ewan", 'Float'>
    readonly taa_remise: FieldRef<"tarif_achat_cenov_dev_ewan", 'Float'>
    readonly taa_montant_net: FieldRef<"tarif_achat_cenov_dev_ewan", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * tarif_achat_cenov_dev_ewan findUnique
   */
  export type tarif_achat_cenov_dev_ewanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which tarif_achat_cenov_dev_ewan to fetch.
     */
    where: tarif_achat_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * tarif_achat_cenov_dev_ewan findUniqueOrThrow
   */
  export type tarif_achat_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which tarif_achat_cenov_dev_ewan to fetch.
     */
    where: tarif_achat_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * tarif_achat_cenov_dev_ewan findFirst
   */
  export type tarif_achat_cenov_dev_ewanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which tarif_achat_cenov_dev_ewan to fetch.
     */
    where?: tarif_achat_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tarif_achat_cenov_dev_ewans to fetch.
     */
    orderBy?: tarif_achat_cenov_dev_ewanOrderByWithRelationInput | tarif_achat_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tarif_achat_cenov_dev_ewans.
     */
    cursor?: tarif_achat_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tarif_achat_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tarif_achat_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tarif_achat_cenov_dev_ewans.
     */
    distinct?: Tarif_achat_cenov_dev_ewanScalarFieldEnum | Tarif_achat_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * tarif_achat_cenov_dev_ewan findFirstOrThrow
   */
  export type tarif_achat_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which tarif_achat_cenov_dev_ewan to fetch.
     */
    where?: tarif_achat_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tarif_achat_cenov_dev_ewans to fetch.
     */
    orderBy?: tarif_achat_cenov_dev_ewanOrderByWithRelationInput | tarif_achat_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for tarif_achat_cenov_dev_ewans.
     */
    cursor?: tarif_achat_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tarif_achat_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tarif_achat_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of tarif_achat_cenov_dev_ewans.
     */
    distinct?: Tarif_achat_cenov_dev_ewanScalarFieldEnum | Tarif_achat_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * tarif_achat_cenov_dev_ewan findMany
   */
  export type tarif_achat_cenov_dev_ewanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which tarif_achat_cenov_dev_ewans to fetch.
     */
    where?: tarif_achat_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of tarif_achat_cenov_dev_ewans to fetch.
     */
    orderBy?: tarif_achat_cenov_dev_ewanOrderByWithRelationInput | tarif_achat_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing tarif_achat_cenov_dev_ewans.
     */
    cursor?: tarif_achat_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` tarif_achat_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` tarif_achat_cenov_dev_ewans.
     */
    skip?: number
    distinct?: Tarif_achat_cenov_dev_ewanScalarFieldEnum | Tarif_achat_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * tarif_achat_cenov_dev_ewan create
   */
  export type tarif_achat_cenov_dev_ewanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to create a tarif_achat_cenov_dev_ewan.
     */
    data: XOR<tarif_achat_cenov_dev_ewanCreateInput, tarif_achat_cenov_dev_ewanUncheckedCreateInput>
  }

  /**
   * tarif_achat_cenov_dev_ewan createMany
   */
  export type tarif_achat_cenov_dev_ewanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many tarif_achat_cenov_dev_ewans.
     */
    data: tarif_achat_cenov_dev_ewanCreateManyInput | tarif_achat_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * tarif_achat_cenov_dev_ewan createManyAndReturn
   */
  export type tarif_achat_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to create many tarif_achat_cenov_dev_ewans.
     */
    data: tarif_achat_cenov_dev_ewanCreateManyInput | tarif_achat_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * tarif_achat_cenov_dev_ewan update
   */
  export type tarif_achat_cenov_dev_ewanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to update a tarif_achat_cenov_dev_ewan.
     */
    data: XOR<tarif_achat_cenov_dev_ewanUpdateInput, tarif_achat_cenov_dev_ewanUncheckedUpdateInput>
    /**
     * Choose, which tarif_achat_cenov_dev_ewan to update.
     */
    where: tarif_achat_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * tarif_achat_cenov_dev_ewan updateMany
   */
  export type tarif_achat_cenov_dev_ewanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update tarif_achat_cenov_dev_ewans.
     */
    data: XOR<tarif_achat_cenov_dev_ewanUpdateManyMutationInput, tarif_achat_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which tarif_achat_cenov_dev_ewans to update
     */
    where?: tarif_achat_cenov_dev_ewanWhereInput
    /**
     * Limit how many tarif_achat_cenov_dev_ewans to update.
     */
    limit?: number
  }

  /**
   * tarif_achat_cenov_dev_ewan updateManyAndReturn
   */
  export type tarif_achat_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to update tarif_achat_cenov_dev_ewans.
     */
    data: XOR<tarif_achat_cenov_dev_ewanUpdateManyMutationInput, tarif_achat_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which tarif_achat_cenov_dev_ewans to update
     */
    where?: tarif_achat_cenov_dev_ewanWhereInput
    /**
     * Limit how many tarif_achat_cenov_dev_ewans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * tarif_achat_cenov_dev_ewan upsert
   */
  export type tarif_achat_cenov_dev_ewanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The filter to search for the tarif_achat_cenov_dev_ewan to update in case it exists.
     */
    where: tarif_achat_cenov_dev_ewanWhereUniqueInput
    /**
     * In case the tarif_achat_cenov_dev_ewan found by the `where` argument doesn't exist, create a new tarif_achat_cenov_dev_ewan with this data.
     */
    create: XOR<tarif_achat_cenov_dev_ewanCreateInput, tarif_achat_cenov_dev_ewanUncheckedCreateInput>
    /**
     * In case the tarif_achat_cenov_dev_ewan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<tarif_achat_cenov_dev_ewanUpdateInput, tarif_achat_cenov_dev_ewanUncheckedUpdateInput>
  }

  /**
   * tarif_achat_cenov_dev_ewan delete
   */
  export type tarif_achat_cenov_dev_ewanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter which tarif_achat_cenov_dev_ewan to delete.
     */
    where: tarif_achat_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * tarif_achat_cenov_dev_ewan deleteMany
   */
  export type tarif_achat_cenov_dev_ewanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which tarif_achat_cenov_dev_ewans to delete
     */
    where?: tarif_achat_cenov_dev_ewanWhereInput
    /**
     * Limit how many tarif_achat_cenov_dev_ewans to delete.
     */
    limit?: number
  }

  /**
   * tarif_achat_cenov_dev_ewan without action
   */
  export type tarif_achat_cenov_dev_ewanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the tarif_achat_cenov_dev_ewan
     */
    select?: tarif_achat_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the tarif_achat_cenov_dev_ewan
     */
    omit?: tarif_achat_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: tarif_achat_cenov_dev_ewanInclude<ExtArgs> | null
  }


  /**
   * Model attribut_cenov_dev_ewan
   */

  export type AggregateAttribut_cenov_dev_ewan = {
    _count: Attribut_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Attribut_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Attribut_cenov_dev_ewanSumAggregateOutputType | null
    _min: Attribut_cenov_dev_ewanMinAggregateOutputType | null
    _max: Attribut_cenov_dev_ewanMaxAggregateOutputType | null
  }

  export type Attribut_cenov_dev_ewanAvgAggregateOutputType = {
    atr_id: number | null
  }

  export type Attribut_cenov_dev_ewanSumAggregateOutputType = {
    atr_id: number | null
  }

  export type Attribut_cenov_dev_ewanMinAggregateOutputType = {
    atr_id: number | null
    atr_nat: string | null
    atr_val: string | null
    atr_label: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Attribut_cenov_dev_ewanMaxAggregateOutputType = {
    atr_id: number | null
    atr_nat: string | null
    atr_val: string | null
    atr_label: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Attribut_cenov_dev_ewanCountAggregateOutputType = {
    atr_id: number
    atr_nat: number
    atr_val: number
    atr_label: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Attribut_cenov_dev_ewanAvgAggregateInputType = {
    atr_id?: true
  }

  export type Attribut_cenov_dev_ewanSumAggregateInputType = {
    atr_id?: true
  }

  export type Attribut_cenov_dev_ewanMinAggregateInputType = {
    atr_id?: true
    atr_nat?: true
    atr_val?: true
    atr_label?: true
    created_at?: true
    updated_at?: true
  }

  export type Attribut_cenov_dev_ewanMaxAggregateInputType = {
    atr_id?: true
    atr_nat?: true
    atr_val?: true
    atr_label?: true
    created_at?: true
    updated_at?: true
  }

  export type Attribut_cenov_dev_ewanCountAggregateInputType = {
    atr_id?: true
    atr_nat?: true
    atr_val?: true
    atr_label?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Attribut_cenov_dev_ewanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which attribut_cenov_dev_ewan to aggregate.
     */
    where?: attribut_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of attribut_cenov_dev_ewans to fetch.
     */
    orderBy?: attribut_cenov_dev_ewanOrderByWithRelationInput | attribut_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: attribut_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` attribut_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` attribut_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned attribut_cenov_dev_ewans
    **/
    _count?: true | Attribut_cenov_dev_ewanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Attribut_cenov_dev_ewanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Attribut_cenov_dev_ewanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Attribut_cenov_dev_ewanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Attribut_cenov_dev_ewanMaxAggregateInputType
  }

  export type GetAttribut_cenov_dev_ewanAggregateType<T extends Attribut_cenov_dev_ewanAggregateArgs> = {
        [P in keyof T & keyof AggregateAttribut_cenov_dev_ewan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAttribut_cenov_dev_ewan[P]>
      : GetScalarType<T[P], AggregateAttribut_cenov_dev_ewan[P]>
  }




  export type attribut_cenov_dev_ewanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: attribut_cenov_dev_ewanWhereInput
    orderBy?: attribut_cenov_dev_ewanOrderByWithAggregationInput | attribut_cenov_dev_ewanOrderByWithAggregationInput[]
    by: Attribut_cenov_dev_ewanScalarFieldEnum[] | Attribut_cenov_dev_ewanScalarFieldEnum
    having?: attribut_cenov_dev_ewanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Attribut_cenov_dev_ewanCountAggregateInputType | true
    _avg?: Attribut_cenov_dev_ewanAvgAggregateInputType
    _sum?: Attribut_cenov_dev_ewanSumAggregateInputType
    _min?: Attribut_cenov_dev_ewanMinAggregateInputType
    _max?: Attribut_cenov_dev_ewanMaxAggregateInputType
  }

  export type Attribut_cenov_dev_ewanGroupByOutputType = {
    atr_id: number
    atr_nat: string | null
    atr_val: string | null
    atr_label: string | null
    created_at: Date | null
    updated_at: Date | null
    _count: Attribut_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Attribut_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Attribut_cenov_dev_ewanSumAggregateOutputType | null
    _min: Attribut_cenov_dev_ewanMinAggregateOutputType | null
    _max: Attribut_cenov_dev_ewanMaxAggregateOutputType | null
  }

  type GetAttribut_cenov_dev_ewanGroupByPayload<T extends attribut_cenov_dev_ewanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Attribut_cenov_dev_ewanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Attribut_cenov_dev_ewanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Attribut_cenov_dev_ewanGroupByOutputType[P]>
            : GetScalarType<T[P], Attribut_cenov_dev_ewanGroupByOutputType[P]>
        }
      >
    >


  export type attribut_cenov_dev_ewanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    atr_id?: boolean
    atr_nat?: boolean
    atr_val?: boolean
    atr_label?: boolean
    created_at?: boolean
    updated_at?: boolean
    categorie_attribut?: boolean | attribut_cenov_dev_ewan$categorie_attributArgs<ExtArgs>
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: boolean | attribut_cenov_dev_ewan$kit_attribute_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs>
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: boolean | attribut_cenov_dev_ewan$kit_attribute_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs>
    _count?: boolean | Attribut_cenov_dev_ewanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["attribut_cenov_dev_ewan"]>

  export type attribut_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    atr_id?: boolean
    atr_nat?: boolean
    atr_val?: boolean
    atr_label?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["attribut_cenov_dev_ewan"]>

  export type attribut_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    atr_id?: boolean
    atr_nat?: boolean
    atr_val?: boolean
    atr_label?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["attribut_cenov_dev_ewan"]>

  export type attribut_cenov_dev_ewanSelectScalar = {
    atr_id?: boolean
    atr_nat?: boolean
    atr_val?: boolean
    atr_label?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type attribut_cenov_dev_ewanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"atr_id" | "atr_nat" | "atr_val" | "atr_label" | "created_at" | "updated_at", ExtArgs["result"]["attribut_cenov_dev_ewan"]>
  export type attribut_cenov_dev_ewanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    categorie_attribut?: boolean | attribut_cenov_dev_ewan$categorie_attributArgs<ExtArgs>
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: boolean | attribut_cenov_dev_ewan$kit_attribute_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs>
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: boolean | attribut_cenov_dev_ewan$kit_attribute_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs>
    _count?: boolean | Attribut_cenov_dev_ewanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type attribut_cenov_dev_ewanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type attribut_cenov_dev_ewanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $attribut_cenov_dev_ewanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "attribut_cenov_dev_ewan"
    objects: {
      categorie_attribut: Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>[]
      kit_attribute_kit_attribute_fk_attribute_caracToattribut: Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>[]
      kit_attribute_kit_attribute_fk_attribute_unitToattribut: Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      atr_id: number
      atr_nat: string | null
      atr_val: string | null
      atr_label: string | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["attribut_cenov_dev_ewan"]>
    composites: {}
  }

  type attribut_cenov_dev_ewanGetPayload<S extends boolean | null | undefined | attribut_cenov_dev_ewanDefaultArgs> = $Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload, S>

  type attribut_cenov_dev_ewanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<attribut_cenov_dev_ewanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Attribut_cenov_dev_ewanCountAggregateInputType | true
    }

  export interface attribut_cenov_dev_ewanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['attribut_cenov_dev_ewan'], meta: { name: 'attribut_cenov_dev_ewan' } }
    /**
     * Find zero or one Attribut_cenov_dev_ewan that matches the filter.
     * @param {attribut_cenov_dev_ewanFindUniqueArgs} args - Arguments to find a Attribut_cenov_dev_ewan
     * @example
     * // Get one Attribut_cenov_dev_ewan
     * const attribut_cenov_dev_ewan = await prisma.attribut_cenov_dev_ewan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends attribut_cenov_dev_ewanFindUniqueArgs>(args: SelectSubset<T, attribut_cenov_dev_ewanFindUniqueArgs<ExtArgs>>): Prisma__attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Attribut_cenov_dev_ewan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {attribut_cenov_dev_ewanFindUniqueOrThrowArgs} args - Arguments to find a Attribut_cenov_dev_ewan
     * @example
     * // Get one Attribut_cenov_dev_ewan
     * const attribut_cenov_dev_ewan = await prisma.attribut_cenov_dev_ewan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends attribut_cenov_dev_ewanFindUniqueOrThrowArgs>(args: SelectSubset<T, attribut_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Attribut_cenov_dev_ewan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {attribut_cenov_dev_ewanFindFirstArgs} args - Arguments to find a Attribut_cenov_dev_ewan
     * @example
     * // Get one Attribut_cenov_dev_ewan
     * const attribut_cenov_dev_ewan = await prisma.attribut_cenov_dev_ewan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends attribut_cenov_dev_ewanFindFirstArgs>(args?: SelectSubset<T, attribut_cenov_dev_ewanFindFirstArgs<ExtArgs>>): Prisma__attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Attribut_cenov_dev_ewan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {attribut_cenov_dev_ewanFindFirstOrThrowArgs} args - Arguments to find a Attribut_cenov_dev_ewan
     * @example
     * // Get one Attribut_cenov_dev_ewan
     * const attribut_cenov_dev_ewan = await prisma.attribut_cenov_dev_ewan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends attribut_cenov_dev_ewanFindFirstOrThrowArgs>(args?: SelectSubset<T, attribut_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>>): Prisma__attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Attribut_cenov_dev_ewans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {attribut_cenov_dev_ewanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Attribut_cenov_dev_ewans
     * const attribut_cenov_dev_ewans = await prisma.attribut_cenov_dev_ewan.findMany()
     * 
     * // Get first 10 Attribut_cenov_dev_ewans
     * const attribut_cenov_dev_ewans = await prisma.attribut_cenov_dev_ewan.findMany({ take: 10 })
     * 
     * // Only select the `atr_id`
     * const attribut_cenov_dev_ewanWithAtr_idOnly = await prisma.attribut_cenov_dev_ewan.findMany({ select: { atr_id: true } })
     * 
     */
    findMany<T extends attribut_cenov_dev_ewanFindManyArgs>(args?: SelectSubset<T, attribut_cenov_dev_ewanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Attribut_cenov_dev_ewan.
     * @param {attribut_cenov_dev_ewanCreateArgs} args - Arguments to create a Attribut_cenov_dev_ewan.
     * @example
     * // Create one Attribut_cenov_dev_ewan
     * const Attribut_cenov_dev_ewan = await prisma.attribut_cenov_dev_ewan.create({
     *   data: {
     *     // ... data to create a Attribut_cenov_dev_ewan
     *   }
     * })
     * 
     */
    create<T extends attribut_cenov_dev_ewanCreateArgs>(args: SelectSubset<T, attribut_cenov_dev_ewanCreateArgs<ExtArgs>>): Prisma__attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Attribut_cenov_dev_ewans.
     * @param {attribut_cenov_dev_ewanCreateManyArgs} args - Arguments to create many Attribut_cenov_dev_ewans.
     * @example
     * // Create many Attribut_cenov_dev_ewans
     * const attribut_cenov_dev_ewan = await prisma.attribut_cenov_dev_ewan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends attribut_cenov_dev_ewanCreateManyArgs>(args?: SelectSubset<T, attribut_cenov_dev_ewanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Attribut_cenov_dev_ewans and returns the data saved in the database.
     * @param {attribut_cenov_dev_ewanCreateManyAndReturnArgs} args - Arguments to create many Attribut_cenov_dev_ewans.
     * @example
     * // Create many Attribut_cenov_dev_ewans
     * const attribut_cenov_dev_ewan = await prisma.attribut_cenov_dev_ewan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Attribut_cenov_dev_ewans and only return the `atr_id`
     * const attribut_cenov_dev_ewanWithAtr_idOnly = await prisma.attribut_cenov_dev_ewan.createManyAndReturn({
     *   select: { atr_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends attribut_cenov_dev_ewanCreateManyAndReturnArgs>(args?: SelectSubset<T, attribut_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Attribut_cenov_dev_ewan.
     * @param {attribut_cenov_dev_ewanDeleteArgs} args - Arguments to delete one Attribut_cenov_dev_ewan.
     * @example
     * // Delete one Attribut_cenov_dev_ewan
     * const Attribut_cenov_dev_ewan = await prisma.attribut_cenov_dev_ewan.delete({
     *   where: {
     *     // ... filter to delete one Attribut_cenov_dev_ewan
     *   }
     * })
     * 
     */
    delete<T extends attribut_cenov_dev_ewanDeleteArgs>(args: SelectSubset<T, attribut_cenov_dev_ewanDeleteArgs<ExtArgs>>): Prisma__attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Attribut_cenov_dev_ewan.
     * @param {attribut_cenov_dev_ewanUpdateArgs} args - Arguments to update one Attribut_cenov_dev_ewan.
     * @example
     * // Update one Attribut_cenov_dev_ewan
     * const attribut_cenov_dev_ewan = await prisma.attribut_cenov_dev_ewan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends attribut_cenov_dev_ewanUpdateArgs>(args: SelectSubset<T, attribut_cenov_dev_ewanUpdateArgs<ExtArgs>>): Prisma__attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Attribut_cenov_dev_ewans.
     * @param {attribut_cenov_dev_ewanDeleteManyArgs} args - Arguments to filter Attribut_cenov_dev_ewans to delete.
     * @example
     * // Delete a few Attribut_cenov_dev_ewans
     * const { count } = await prisma.attribut_cenov_dev_ewan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends attribut_cenov_dev_ewanDeleteManyArgs>(args?: SelectSubset<T, attribut_cenov_dev_ewanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Attribut_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {attribut_cenov_dev_ewanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Attribut_cenov_dev_ewans
     * const attribut_cenov_dev_ewan = await prisma.attribut_cenov_dev_ewan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends attribut_cenov_dev_ewanUpdateManyArgs>(args: SelectSubset<T, attribut_cenov_dev_ewanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Attribut_cenov_dev_ewans and returns the data updated in the database.
     * @param {attribut_cenov_dev_ewanUpdateManyAndReturnArgs} args - Arguments to update many Attribut_cenov_dev_ewans.
     * @example
     * // Update many Attribut_cenov_dev_ewans
     * const attribut_cenov_dev_ewan = await prisma.attribut_cenov_dev_ewan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Attribut_cenov_dev_ewans and only return the `atr_id`
     * const attribut_cenov_dev_ewanWithAtr_idOnly = await prisma.attribut_cenov_dev_ewan.updateManyAndReturn({
     *   select: { atr_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends attribut_cenov_dev_ewanUpdateManyAndReturnArgs>(args: SelectSubset<T, attribut_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Attribut_cenov_dev_ewan.
     * @param {attribut_cenov_dev_ewanUpsertArgs} args - Arguments to update or create a Attribut_cenov_dev_ewan.
     * @example
     * // Update or create a Attribut_cenov_dev_ewan
     * const attribut_cenov_dev_ewan = await prisma.attribut_cenov_dev_ewan.upsert({
     *   create: {
     *     // ... data to create a Attribut_cenov_dev_ewan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Attribut_cenov_dev_ewan we want to update
     *   }
     * })
     */
    upsert<T extends attribut_cenov_dev_ewanUpsertArgs>(args: SelectSubset<T, attribut_cenov_dev_ewanUpsertArgs<ExtArgs>>): Prisma__attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Attribut_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {attribut_cenov_dev_ewanCountArgs} args - Arguments to filter Attribut_cenov_dev_ewans to count.
     * @example
     * // Count the number of Attribut_cenov_dev_ewans
     * const count = await prisma.attribut_cenov_dev_ewan.count({
     *   where: {
     *     // ... the filter for the Attribut_cenov_dev_ewans we want to count
     *   }
     * })
    **/
    count<T extends attribut_cenov_dev_ewanCountArgs>(
      args?: Subset<T, attribut_cenov_dev_ewanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Attribut_cenov_dev_ewanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Attribut_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Attribut_cenov_dev_ewanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Attribut_cenov_dev_ewanAggregateArgs>(args: Subset<T, Attribut_cenov_dev_ewanAggregateArgs>): Prisma.PrismaPromise<GetAttribut_cenov_dev_ewanAggregateType<T>>

    /**
     * Group by Attribut_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {attribut_cenov_dev_ewanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends attribut_cenov_dev_ewanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: attribut_cenov_dev_ewanGroupByArgs['orderBy'] }
        : { orderBy?: attribut_cenov_dev_ewanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, attribut_cenov_dev_ewanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAttribut_cenov_dev_ewanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the attribut_cenov_dev_ewan model
   */
  readonly fields: attribut_cenov_dev_ewanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for attribut_cenov_dev_ewan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__attribut_cenov_dev_ewanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    categorie_attribut<T extends attribut_cenov_dev_ewan$categorie_attributArgs<ExtArgs> = {}>(args?: Subset<T, attribut_cenov_dev_ewan$categorie_attributArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$categorie_attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    kit_attribute_kit_attribute_fk_attribute_caracToattribut<T extends attribut_cenov_dev_ewan$kit_attribute_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs> = {}>(args?: Subset<T, attribut_cenov_dev_ewan$kit_attribute_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    kit_attribute_kit_attribute_fk_attribute_unitToattribut<T extends attribut_cenov_dev_ewan$kit_attribute_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs> = {}>(args?: Subset<T, attribut_cenov_dev_ewan$kit_attribute_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the attribut_cenov_dev_ewan model
   */
  interface attribut_cenov_dev_ewanFieldRefs {
    readonly atr_id: FieldRef<"attribut_cenov_dev_ewan", 'Int'>
    readonly atr_nat: FieldRef<"attribut_cenov_dev_ewan", 'String'>
    readonly atr_val: FieldRef<"attribut_cenov_dev_ewan", 'String'>
    readonly atr_label: FieldRef<"attribut_cenov_dev_ewan", 'String'>
    readonly created_at: FieldRef<"attribut_cenov_dev_ewan", 'DateTime'>
    readonly updated_at: FieldRef<"attribut_cenov_dev_ewan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * attribut_cenov_dev_ewan findUnique
   */
  export type attribut_cenov_dev_ewanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which attribut_cenov_dev_ewan to fetch.
     */
    where: attribut_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * attribut_cenov_dev_ewan findUniqueOrThrow
   */
  export type attribut_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which attribut_cenov_dev_ewan to fetch.
     */
    where: attribut_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * attribut_cenov_dev_ewan findFirst
   */
  export type attribut_cenov_dev_ewanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which attribut_cenov_dev_ewan to fetch.
     */
    where?: attribut_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of attribut_cenov_dev_ewans to fetch.
     */
    orderBy?: attribut_cenov_dev_ewanOrderByWithRelationInput | attribut_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for attribut_cenov_dev_ewans.
     */
    cursor?: attribut_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` attribut_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` attribut_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of attribut_cenov_dev_ewans.
     */
    distinct?: Attribut_cenov_dev_ewanScalarFieldEnum | Attribut_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * attribut_cenov_dev_ewan findFirstOrThrow
   */
  export type attribut_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which attribut_cenov_dev_ewan to fetch.
     */
    where?: attribut_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of attribut_cenov_dev_ewans to fetch.
     */
    orderBy?: attribut_cenov_dev_ewanOrderByWithRelationInput | attribut_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for attribut_cenov_dev_ewans.
     */
    cursor?: attribut_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` attribut_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` attribut_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of attribut_cenov_dev_ewans.
     */
    distinct?: Attribut_cenov_dev_ewanScalarFieldEnum | Attribut_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * attribut_cenov_dev_ewan findMany
   */
  export type attribut_cenov_dev_ewanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which attribut_cenov_dev_ewans to fetch.
     */
    where?: attribut_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of attribut_cenov_dev_ewans to fetch.
     */
    orderBy?: attribut_cenov_dev_ewanOrderByWithRelationInput | attribut_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing attribut_cenov_dev_ewans.
     */
    cursor?: attribut_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` attribut_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` attribut_cenov_dev_ewans.
     */
    skip?: number
    distinct?: Attribut_cenov_dev_ewanScalarFieldEnum | Attribut_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * attribut_cenov_dev_ewan create
   */
  export type attribut_cenov_dev_ewanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to create a attribut_cenov_dev_ewan.
     */
    data?: XOR<attribut_cenov_dev_ewanCreateInput, attribut_cenov_dev_ewanUncheckedCreateInput>
  }

  /**
   * attribut_cenov_dev_ewan createMany
   */
  export type attribut_cenov_dev_ewanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many attribut_cenov_dev_ewans.
     */
    data: attribut_cenov_dev_ewanCreateManyInput | attribut_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * attribut_cenov_dev_ewan createManyAndReturn
   */
  export type attribut_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to create many attribut_cenov_dev_ewans.
     */
    data: attribut_cenov_dev_ewanCreateManyInput | attribut_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * attribut_cenov_dev_ewan update
   */
  export type attribut_cenov_dev_ewanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to update a attribut_cenov_dev_ewan.
     */
    data: XOR<attribut_cenov_dev_ewanUpdateInput, attribut_cenov_dev_ewanUncheckedUpdateInput>
    /**
     * Choose, which attribut_cenov_dev_ewan to update.
     */
    where: attribut_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * attribut_cenov_dev_ewan updateMany
   */
  export type attribut_cenov_dev_ewanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update attribut_cenov_dev_ewans.
     */
    data: XOR<attribut_cenov_dev_ewanUpdateManyMutationInput, attribut_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which attribut_cenov_dev_ewans to update
     */
    where?: attribut_cenov_dev_ewanWhereInput
    /**
     * Limit how many attribut_cenov_dev_ewans to update.
     */
    limit?: number
  }

  /**
   * attribut_cenov_dev_ewan updateManyAndReturn
   */
  export type attribut_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to update attribut_cenov_dev_ewans.
     */
    data: XOR<attribut_cenov_dev_ewanUpdateManyMutationInput, attribut_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which attribut_cenov_dev_ewans to update
     */
    where?: attribut_cenov_dev_ewanWhereInput
    /**
     * Limit how many attribut_cenov_dev_ewans to update.
     */
    limit?: number
  }

  /**
   * attribut_cenov_dev_ewan upsert
   */
  export type attribut_cenov_dev_ewanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The filter to search for the attribut_cenov_dev_ewan to update in case it exists.
     */
    where: attribut_cenov_dev_ewanWhereUniqueInput
    /**
     * In case the attribut_cenov_dev_ewan found by the `where` argument doesn't exist, create a new attribut_cenov_dev_ewan with this data.
     */
    create: XOR<attribut_cenov_dev_ewanCreateInput, attribut_cenov_dev_ewanUncheckedCreateInput>
    /**
     * In case the attribut_cenov_dev_ewan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<attribut_cenov_dev_ewanUpdateInput, attribut_cenov_dev_ewanUncheckedUpdateInput>
  }

  /**
   * attribut_cenov_dev_ewan delete
   */
  export type attribut_cenov_dev_ewanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: attribut_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter which attribut_cenov_dev_ewan to delete.
     */
    where: attribut_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * attribut_cenov_dev_ewan deleteMany
   */
  export type attribut_cenov_dev_ewanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which attribut_cenov_dev_ewans to delete
     */
    where?: attribut_cenov_dev_ewanWhereInput
    /**
     * Limit how many attribut_cenov_dev_ewans to delete.
     */
    limit?: number
  }

  /**
   * attribut_cenov_dev_ewan.categorie_attribut
   */
  export type attribut_cenov_dev_ewan$categorie_attributArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the categorie_attribut_cenov_dev_ewan
     */
    select?: categorie_attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the categorie_attribut_cenov_dev_ewan
     */
    omit?: categorie_attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: categorie_attribut_cenov_dev_ewanInclude<ExtArgs> | null
    where?: categorie_attribut_cenov_dev_ewanWhereInput
    orderBy?: categorie_attribut_cenov_dev_ewanOrderByWithRelationInput | categorie_attribut_cenov_dev_ewanOrderByWithRelationInput[]
    cursor?: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Categorie_attribut_cenov_dev_ewanScalarFieldEnum | Categorie_attribut_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * attribut_cenov_dev_ewan.kit_attribute_kit_attribute_fk_attribute_caracToattribut
   */
  export type attribut_cenov_dev_ewan$kit_attribute_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
    where?: kit_attribute_cenov_dev_ewanWhereInput
    orderBy?: kit_attribute_cenov_dev_ewanOrderByWithRelationInput | kit_attribute_cenov_dev_ewanOrderByWithRelationInput[]
    cursor?: kit_attribute_cenov_dev_ewanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Kit_attribute_cenov_dev_ewanScalarFieldEnum | Kit_attribute_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * attribut_cenov_dev_ewan.kit_attribute_kit_attribute_fk_attribute_unitToattribut
   */
  export type attribut_cenov_dev_ewan$kit_attribute_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
    where?: kit_attribute_cenov_dev_ewanWhereInput
    orderBy?: kit_attribute_cenov_dev_ewanOrderByWithRelationInput | kit_attribute_cenov_dev_ewanOrderByWithRelationInput[]
    cursor?: kit_attribute_cenov_dev_ewanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Kit_attribute_cenov_dev_ewanScalarFieldEnum | Kit_attribute_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * attribut_cenov_dev_ewan without action
   */
  export type attribut_cenov_dev_ewanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: attribut_cenov_dev_ewanInclude<ExtArgs> | null
  }


  /**
   * Model fournisseur
   */

  export type AggregateFournisseur = {
    _count: FournisseurCountAggregateOutputType | null
    _avg: FournisseurAvgAggregateOutputType | null
    _sum: FournisseurSumAggregateOutputType | null
    _min: FournisseurMinAggregateOutputType | null
    _max: FournisseurMaxAggregateOutputType | null
  }

  export type FournisseurAvgAggregateOutputType = {
    frs_id: number | null
  }

  export type FournisseurSumAggregateOutputType = {
    frs_id: number | null
  }

  export type FournisseurMinAggregateOutputType = {
    frs_id: number | null
    frs_code: string | null
    frs_label: string | null
  }

  export type FournisseurMaxAggregateOutputType = {
    frs_id: number | null
    frs_code: string | null
    frs_label: string | null
  }

  export type FournisseurCountAggregateOutputType = {
    frs_id: number
    frs_code: number
    frs_label: number
    _all: number
  }


  export type FournisseurAvgAggregateInputType = {
    frs_id?: true
  }

  export type FournisseurSumAggregateInputType = {
    frs_id?: true
  }

  export type FournisseurMinAggregateInputType = {
    frs_id?: true
    frs_code?: true
    frs_label?: true
  }

  export type FournisseurMaxAggregateInputType = {
    frs_id?: true
    frs_code?: true
    frs_label?: true
  }

  export type FournisseurCountAggregateInputType = {
    frs_id?: true
    frs_code?: true
    frs_label?: true
    _all?: true
  }

  export type FournisseurAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which fournisseur to aggregate.
     */
    where?: fournisseurWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of fournisseurs to fetch.
     */
    orderBy?: fournisseurOrderByWithRelationInput | fournisseurOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: fournisseurWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` fournisseurs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` fournisseurs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned fournisseurs
    **/
    _count?: true | FournisseurCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FournisseurAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FournisseurSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FournisseurMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FournisseurMaxAggregateInputType
  }

  export type GetFournisseurAggregateType<T extends FournisseurAggregateArgs> = {
        [P in keyof T & keyof AggregateFournisseur]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFournisseur[P]>
      : GetScalarType<T[P], AggregateFournisseur[P]>
  }




  export type fournisseurGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: fournisseurWhereInput
    orderBy?: fournisseurOrderByWithAggregationInput | fournisseurOrderByWithAggregationInput[]
    by: FournisseurScalarFieldEnum[] | FournisseurScalarFieldEnum
    having?: fournisseurScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FournisseurCountAggregateInputType | true
    _avg?: FournisseurAvgAggregateInputType
    _sum?: FournisseurSumAggregateInputType
    _min?: FournisseurMinAggregateInputType
    _max?: FournisseurMaxAggregateInputType
  }

  export type FournisseurGroupByOutputType = {
    frs_id: number
    frs_code: string
    frs_label: string | null
    _count: FournisseurCountAggregateOutputType | null
    _avg: FournisseurAvgAggregateOutputType | null
    _sum: FournisseurSumAggregateOutputType | null
    _min: FournisseurMinAggregateOutputType | null
    _max: FournisseurMaxAggregateOutputType | null
  }

  type GetFournisseurGroupByPayload<T extends fournisseurGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FournisseurGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FournisseurGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FournisseurGroupByOutputType[P]>
            : GetScalarType<T[P], FournisseurGroupByOutputType[P]>
        }
      >
    >


  export type fournisseurSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    frs_id?: boolean
    frs_code?: boolean
    frs_label?: boolean
    famille?: boolean | fournisseur$familleArgs<ExtArgs>
    produit?: boolean | fournisseur$produitArgs<ExtArgs>
    _count?: boolean | FournisseurCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["fournisseur"]>

  export type fournisseurSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    frs_id?: boolean
    frs_code?: boolean
    frs_label?: boolean
  }, ExtArgs["result"]["fournisseur"]>

  export type fournisseurSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    frs_id?: boolean
    frs_code?: boolean
    frs_label?: boolean
  }, ExtArgs["result"]["fournisseur"]>

  export type fournisseurSelectScalar = {
    frs_id?: boolean
    frs_code?: boolean
    frs_label?: boolean
  }

  export type fournisseurOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"frs_id" | "frs_code" | "frs_label", ExtArgs["result"]["fournisseur"]>
  export type fournisseurInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    famille?: boolean | fournisseur$familleArgs<ExtArgs>
    produit?: boolean | fournisseur$produitArgs<ExtArgs>
    _count?: boolean | FournisseurCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type fournisseurIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type fournisseurIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $fournisseurPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "fournisseur"
    objects: {
      famille: Prisma.$famillePayload<ExtArgs>[]
      produit: Prisma.$produitPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      frs_id: number
      frs_code: string
      frs_label: string | null
    }, ExtArgs["result"]["fournisseur"]>
    composites: {}
  }

  type fournisseurGetPayload<S extends boolean | null | undefined | fournisseurDefaultArgs> = $Result.GetResult<Prisma.$fournisseurPayload, S>

  type fournisseurCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<fournisseurFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FournisseurCountAggregateInputType | true
    }

  export interface fournisseurDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['fournisseur'], meta: { name: 'fournisseur' } }
    /**
     * Find zero or one Fournisseur that matches the filter.
     * @param {fournisseurFindUniqueArgs} args - Arguments to find a Fournisseur
     * @example
     * // Get one Fournisseur
     * const fournisseur = await prisma.fournisseur.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends fournisseurFindUniqueArgs>(args: SelectSubset<T, fournisseurFindUniqueArgs<ExtArgs>>): Prisma__fournisseurClient<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Fournisseur that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {fournisseurFindUniqueOrThrowArgs} args - Arguments to find a Fournisseur
     * @example
     * // Get one Fournisseur
     * const fournisseur = await prisma.fournisseur.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends fournisseurFindUniqueOrThrowArgs>(args: SelectSubset<T, fournisseurFindUniqueOrThrowArgs<ExtArgs>>): Prisma__fournisseurClient<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Fournisseur that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {fournisseurFindFirstArgs} args - Arguments to find a Fournisseur
     * @example
     * // Get one Fournisseur
     * const fournisseur = await prisma.fournisseur.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends fournisseurFindFirstArgs>(args?: SelectSubset<T, fournisseurFindFirstArgs<ExtArgs>>): Prisma__fournisseurClient<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Fournisseur that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {fournisseurFindFirstOrThrowArgs} args - Arguments to find a Fournisseur
     * @example
     * // Get one Fournisseur
     * const fournisseur = await prisma.fournisseur.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends fournisseurFindFirstOrThrowArgs>(args?: SelectSubset<T, fournisseurFindFirstOrThrowArgs<ExtArgs>>): Prisma__fournisseurClient<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Fournisseurs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {fournisseurFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Fournisseurs
     * const fournisseurs = await prisma.fournisseur.findMany()
     * 
     * // Get first 10 Fournisseurs
     * const fournisseurs = await prisma.fournisseur.findMany({ take: 10 })
     * 
     * // Only select the `frs_id`
     * const fournisseurWithFrs_idOnly = await prisma.fournisseur.findMany({ select: { frs_id: true } })
     * 
     */
    findMany<T extends fournisseurFindManyArgs>(args?: SelectSubset<T, fournisseurFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Fournisseur.
     * @param {fournisseurCreateArgs} args - Arguments to create a Fournisseur.
     * @example
     * // Create one Fournisseur
     * const Fournisseur = await prisma.fournisseur.create({
     *   data: {
     *     // ... data to create a Fournisseur
     *   }
     * })
     * 
     */
    create<T extends fournisseurCreateArgs>(args: SelectSubset<T, fournisseurCreateArgs<ExtArgs>>): Prisma__fournisseurClient<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Fournisseurs.
     * @param {fournisseurCreateManyArgs} args - Arguments to create many Fournisseurs.
     * @example
     * // Create many Fournisseurs
     * const fournisseur = await prisma.fournisseur.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends fournisseurCreateManyArgs>(args?: SelectSubset<T, fournisseurCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Fournisseurs and returns the data saved in the database.
     * @param {fournisseurCreateManyAndReturnArgs} args - Arguments to create many Fournisseurs.
     * @example
     * // Create many Fournisseurs
     * const fournisseur = await prisma.fournisseur.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Fournisseurs and only return the `frs_id`
     * const fournisseurWithFrs_idOnly = await prisma.fournisseur.createManyAndReturn({
     *   select: { frs_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends fournisseurCreateManyAndReturnArgs>(args?: SelectSubset<T, fournisseurCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Fournisseur.
     * @param {fournisseurDeleteArgs} args - Arguments to delete one Fournisseur.
     * @example
     * // Delete one Fournisseur
     * const Fournisseur = await prisma.fournisseur.delete({
     *   where: {
     *     // ... filter to delete one Fournisseur
     *   }
     * })
     * 
     */
    delete<T extends fournisseurDeleteArgs>(args: SelectSubset<T, fournisseurDeleteArgs<ExtArgs>>): Prisma__fournisseurClient<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Fournisseur.
     * @param {fournisseurUpdateArgs} args - Arguments to update one Fournisseur.
     * @example
     * // Update one Fournisseur
     * const fournisseur = await prisma.fournisseur.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends fournisseurUpdateArgs>(args: SelectSubset<T, fournisseurUpdateArgs<ExtArgs>>): Prisma__fournisseurClient<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Fournisseurs.
     * @param {fournisseurDeleteManyArgs} args - Arguments to filter Fournisseurs to delete.
     * @example
     * // Delete a few Fournisseurs
     * const { count } = await prisma.fournisseur.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends fournisseurDeleteManyArgs>(args?: SelectSubset<T, fournisseurDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Fournisseurs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {fournisseurUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Fournisseurs
     * const fournisseur = await prisma.fournisseur.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends fournisseurUpdateManyArgs>(args: SelectSubset<T, fournisseurUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Fournisseurs and returns the data updated in the database.
     * @param {fournisseurUpdateManyAndReturnArgs} args - Arguments to update many Fournisseurs.
     * @example
     * // Update many Fournisseurs
     * const fournisseur = await prisma.fournisseur.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Fournisseurs and only return the `frs_id`
     * const fournisseurWithFrs_idOnly = await prisma.fournisseur.updateManyAndReturn({
     *   select: { frs_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends fournisseurUpdateManyAndReturnArgs>(args: SelectSubset<T, fournisseurUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Fournisseur.
     * @param {fournisseurUpsertArgs} args - Arguments to update or create a Fournisseur.
     * @example
     * // Update or create a Fournisseur
     * const fournisseur = await prisma.fournisseur.upsert({
     *   create: {
     *     // ... data to create a Fournisseur
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Fournisseur we want to update
     *   }
     * })
     */
    upsert<T extends fournisseurUpsertArgs>(args: SelectSubset<T, fournisseurUpsertArgs<ExtArgs>>): Prisma__fournisseurClient<$Result.GetResult<Prisma.$fournisseurPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Fournisseurs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {fournisseurCountArgs} args - Arguments to filter Fournisseurs to count.
     * @example
     * // Count the number of Fournisseurs
     * const count = await prisma.fournisseur.count({
     *   where: {
     *     // ... the filter for the Fournisseurs we want to count
     *   }
     * })
    **/
    count<T extends fournisseurCountArgs>(
      args?: Subset<T, fournisseurCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FournisseurCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Fournisseur.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FournisseurAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FournisseurAggregateArgs>(args: Subset<T, FournisseurAggregateArgs>): Prisma.PrismaPromise<GetFournisseurAggregateType<T>>

    /**
     * Group by Fournisseur.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {fournisseurGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends fournisseurGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: fournisseurGroupByArgs['orderBy'] }
        : { orderBy?: fournisseurGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, fournisseurGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFournisseurGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the fournisseur model
   */
  readonly fields: fournisseurFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for fournisseur.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__fournisseurClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    famille<T extends fournisseur$familleArgs<ExtArgs> = {}>(args?: Subset<T, fournisseur$familleArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$famillePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    produit<T extends fournisseur$produitArgs<ExtArgs> = {}>(args?: Subset<T, fournisseur$produitArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the fournisseur model
   */
  interface fournisseurFieldRefs {
    readonly frs_id: FieldRef<"fournisseur", 'Int'>
    readonly frs_code: FieldRef<"fournisseur", 'String'>
    readonly frs_label: FieldRef<"fournisseur", 'String'>
  }
    

  // Custom InputTypes
  /**
   * fournisseur findUnique
   */
  export type fournisseurFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: fournisseurInclude<ExtArgs> | null
    /**
     * Filter, which fournisseur to fetch.
     */
    where: fournisseurWhereUniqueInput
  }

  /**
   * fournisseur findUniqueOrThrow
   */
  export type fournisseurFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: fournisseurInclude<ExtArgs> | null
    /**
     * Filter, which fournisseur to fetch.
     */
    where: fournisseurWhereUniqueInput
  }

  /**
   * fournisseur findFirst
   */
  export type fournisseurFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: fournisseurInclude<ExtArgs> | null
    /**
     * Filter, which fournisseur to fetch.
     */
    where?: fournisseurWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of fournisseurs to fetch.
     */
    orderBy?: fournisseurOrderByWithRelationInput | fournisseurOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for fournisseurs.
     */
    cursor?: fournisseurWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` fournisseurs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` fournisseurs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of fournisseurs.
     */
    distinct?: FournisseurScalarFieldEnum | FournisseurScalarFieldEnum[]
  }

  /**
   * fournisseur findFirstOrThrow
   */
  export type fournisseurFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: fournisseurInclude<ExtArgs> | null
    /**
     * Filter, which fournisseur to fetch.
     */
    where?: fournisseurWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of fournisseurs to fetch.
     */
    orderBy?: fournisseurOrderByWithRelationInput | fournisseurOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for fournisseurs.
     */
    cursor?: fournisseurWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` fournisseurs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` fournisseurs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of fournisseurs.
     */
    distinct?: FournisseurScalarFieldEnum | FournisseurScalarFieldEnum[]
  }

  /**
   * fournisseur findMany
   */
  export type fournisseurFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: fournisseurInclude<ExtArgs> | null
    /**
     * Filter, which fournisseurs to fetch.
     */
    where?: fournisseurWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of fournisseurs to fetch.
     */
    orderBy?: fournisseurOrderByWithRelationInput | fournisseurOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing fournisseurs.
     */
    cursor?: fournisseurWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` fournisseurs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` fournisseurs.
     */
    skip?: number
    distinct?: FournisseurScalarFieldEnum | FournisseurScalarFieldEnum[]
  }

  /**
   * fournisseur create
   */
  export type fournisseurCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: fournisseurInclude<ExtArgs> | null
    /**
     * The data needed to create a fournisseur.
     */
    data: XOR<fournisseurCreateInput, fournisseurUncheckedCreateInput>
  }

  /**
   * fournisseur createMany
   */
  export type fournisseurCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many fournisseurs.
     */
    data: fournisseurCreateManyInput | fournisseurCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * fournisseur createManyAndReturn
   */
  export type fournisseurCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * The data used to create many fournisseurs.
     */
    data: fournisseurCreateManyInput | fournisseurCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * fournisseur update
   */
  export type fournisseurUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: fournisseurInclude<ExtArgs> | null
    /**
     * The data needed to update a fournisseur.
     */
    data: XOR<fournisseurUpdateInput, fournisseurUncheckedUpdateInput>
    /**
     * Choose, which fournisseur to update.
     */
    where: fournisseurWhereUniqueInput
  }

  /**
   * fournisseur updateMany
   */
  export type fournisseurUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update fournisseurs.
     */
    data: XOR<fournisseurUpdateManyMutationInput, fournisseurUncheckedUpdateManyInput>
    /**
     * Filter which fournisseurs to update
     */
    where?: fournisseurWhereInput
    /**
     * Limit how many fournisseurs to update.
     */
    limit?: number
  }

  /**
   * fournisseur updateManyAndReturn
   */
  export type fournisseurUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * The data used to update fournisseurs.
     */
    data: XOR<fournisseurUpdateManyMutationInput, fournisseurUncheckedUpdateManyInput>
    /**
     * Filter which fournisseurs to update
     */
    where?: fournisseurWhereInput
    /**
     * Limit how many fournisseurs to update.
     */
    limit?: number
  }

  /**
   * fournisseur upsert
   */
  export type fournisseurUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: fournisseurInclude<ExtArgs> | null
    /**
     * The filter to search for the fournisseur to update in case it exists.
     */
    where: fournisseurWhereUniqueInput
    /**
     * In case the fournisseur found by the `where` argument doesn't exist, create a new fournisseur with this data.
     */
    create: XOR<fournisseurCreateInput, fournisseurUncheckedCreateInput>
    /**
     * In case the fournisseur was found with the provided `where` argument, update it with this data.
     */
    update: XOR<fournisseurUpdateInput, fournisseurUncheckedUpdateInput>
  }

  /**
   * fournisseur delete
   */
  export type fournisseurDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: fournisseurInclude<ExtArgs> | null
    /**
     * Filter which fournisseur to delete.
     */
    where: fournisseurWhereUniqueInput
  }

  /**
   * fournisseur deleteMany
   */
  export type fournisseurDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which fournisseurs to delete
     */
    where?: fournisseurWhereInput
    /**
     * Limit how many fournisseurs to delete.
     */
    limit?: number
  }

  /**
   * fournisseur.famille
   */
  export type fournisseur$familleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille
     */
    select?: familleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille
     */
    omit?: familleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: familleInclude<ExtArgs> | null
    where?: familleWhereInput
    orderBy?: familleOrderByWithRelationInput | familleOrderByWithRelationInput[]
    cursor?: familleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FamilleScalarFieldEnum | FamilleScalarFieldEnum[]
  }

  /**
   * fournisseur.produit
   */
  export type fournisseur$produitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitInclude<ExtArgs> | null
    where?: produitWhereInput
    orderBy?: produitOrderByWithRelationInput | produitOrderByWithRelationInput[]
    cursor?: produitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProduitScalarFieldEnum | ProduitScalarFieldEnum[]
  }

  /**
   * fournisseur without action
   */
  export type fournisseurDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the fournisseur
     */
    select?: fournisseurSelect<ExtArgs> | null
    /**
     * Omit specific fields from the fournisseur
     */
    omit?: fournisseurOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: fournisseurInclude<ExtArgs> | null
  }


  /**
   * Model kit_cenov_dev_ewan
   */

  export type AggregateKit_cenov_dev_ewan = {
    _count: Kit_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Kit_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Kit_cenov_dev_ewanSumAggregateOutputType | null
    _min: Kit_cenov_dev_ewanMinAggregateOutputType | null
    _max: Kit_cenov_dev_ewanMaxAggregateOutputType | null
  }

  export type Kit_cenov_dev_ewanAvgAggregateOutputType = {
    kit_id: number | null
  }

  export type Kit_cenov_dev_ewanSumAggregateOutputType = {
    kit_id: number | null
  }

  export type Kit_cenov_dev_ewanMinAggregateOutputType = {
    kit_id: number | null
    kit_label: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Kit_cenov_dev_ewanMaxAggregateOutputType = {
    kit_id: number | null
    kit_label: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Kit_cenov_dev_ewanCountAggregateOutputType = {
    kit_id: number
    kit_label: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Kit_cenov_dev_ewanAvgAggregateInputType = {
    kit_id?: true
  }

  export type Kit_cenov_dev_ewanSumAggregateInputType = {
    kit_id?: true
  }

  export type Kit_cenov_dev_ewanMinAggregateInputType = {
    kit_id?: true
    kit_label?: true
    created_at?: true
    updated_at?: true
  }

  export type Kit_cenov_dev_ewanMaxAggregateInputType = {
    kit_id?: true
    kit_label?: true
    created_at?: true
    updated_at?: true
  }

  export type Kit_cenov_dev_ewanCountAggregateInputType = {
    kit_id?: true
    kit_label?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Kit_cenov_dev_ewanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which kit_cenov_dev_ewan to aggregate.
     */
    where?: kit_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of kit_cenov_dev_ewans to fetch.
     */
    orderBy?: kit_cenov_dev_ewanOrderByWithRelationInput | kit_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: kit_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` kit_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` kit_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned kit_cenov_dev_ewans
    **/
    _count?: true | Kit_cenov_dev_ewanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Kit_cenov_dev_ewanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Kit_cenov_dev_ewanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Kit_cenov_dev_ewanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Kit_cenov_dev_ewanMaxAggregateInputType
  }

  export type GetKit_cenov_dev_ewanAggregateType<T extends Kit_cenov_dev_ewanAggregateArgs> = {
        [P in keyof T & keyof AggregateKit_cenov_dev_ewan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKit_cenov_dev_ewan[P]>
      : GetScalarType<T[P], AggregateKit_cenov_dev_ewan[P]>
  }




  export type kit_cenov_dev_ewanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: kit_cenov_dev_ewanWhereInput
    orderBy?: kit_cenov_dev_ewanOrderByWithAggregationInput | kit_cenov_dev_ewanOrderByWithAggregationInput[]
    by: Kit_cenov_dev_ewanScalarFieldEnum[] | Kit_cenov_dev_ewanScalarFieldEnum
    having?: kit_cenov_dev_ewanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Kit_cenov_dev_ewanCountAggregateInputType | true
    _avg?: Kit_cenov_dev_ewanAvgAggregateInputType
    _sum?: Kit_cenov_dev_ewanSumAggregateInputType
    _min?: Kit_cenov_dev_ewanMinAggregateInputType
    _max?: Kit_cenov_dev_ewanMaxAggregateInputType
  }

  export type Kit_cenov_dev_ewanGroupByOutputType = {
    kit_id: number
    kit_label: string | null
    created_at: Date | null
    updated_at: Date | null
    _count: Kit_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Kit_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Kit_cenov_dev_ewanSumAggregateOutputType | null
    _min: Kit_cenov_dev_ewanMinAggregateOutputType | null
    _max: Kit_cenov_dev_ewanMaxAggregateOutputType | null
  }

  type GetKit_cenov_dev_ewanGroupByPayload<T extends kit_cenov_dev_ewanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Kit_cenov_dev_ewanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Kit_cenov_dev_ewanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Kit_cenov_dev_ewanGroupByOutputType[P]>
            : GetScalarType<T[P], Kit_cenov_dev_ewanGroupByOutputType[P]>
        }
      >
    >


  export type kit_cenov_dev_ewanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    kit_id?: boolean
    kit_label?: boolean
    created_at?: boolean
    updated_at?: boolean
    produit?: boolean | kit_cenov_dev_ewan$produitArgs<ExtArgs>
    kit_attribute?: boolean | kit_cenov_dev_ewan$kit_attributeArgs<ExtArgs>
    part_nc?: boolean | kit_cenov_dev_ewan$part_ncArgs<ExtArgs>
    _count?: boolean | Kit_cenov_dev_ewanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kit_cenov_dev_ewan"]>

  export type kit_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    kit_id?: boolean
    kit_label?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["kit_cenov_dev_ewan"]>

  export type kit_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    kit_id?: boolean
    kit_label?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["kit_cenov_dev_ewan"]>

  export type kit_cenov_dev_ewanSelectScalar = {
    kit_id?: boolean
    kit_label?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type kit_cenov_dev_ewanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"kit_id" | "kit_label" | "created_at" | "updated_at", ExtArgs["result"]["kit_cenov_dev_ewan"]>
  export type kit_cenov_dev_ewanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    produit?: boolean | kit_cenov_dev_ewan$produitArgs<ExtArgs>
    kit_attribute?: boolean | kit_cenov_dev_ewan$kit_attributeArgs<ExtArgs>
    part_nc?: boolean | kit_cenov_dev_ewan$part_ncArgs<ExtArgs>
    _count?: boolean | Kit_cenov_dev_ewanCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type kit_cenov_dev_ewanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type kit_cenov_dev_ewanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $kit_cenov_dev_ewanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "kit_cenov_dev_ewan"
    objects: {
      produit: Prisma.$produitPayload<ExtArgs>[]
      kit_attribute: Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>[]
      part_nc: Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      kit_id: number
      kit_label: string | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["kit_cenov_dev_ewan"]>
    composites: {}
  }

  type kit_cenov_dev_ewanGetPayload<S extends boolean | null | undefined | kit_cenov_dev_ewanDefaultArgs> = $Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload, S>

  type kit_cenov_dev_ewanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<kit_cenov_dev_ewanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Kit_cenov_dev_ewanCountAggregateInputType | true
    }

  export interface kit_cenov_dev_ewanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['kit_cenov_dev_ewan'], meta: { name: 'kit_cenov_dev_ewan' } }
    /**
     * Find zero or one Kit_cenov_dev_ewan that matches the filter.
     * @param {kit_cenov_dev_ewanFindUniqueArgs} args - Arguments to find a Kit_cenov_dev_ewan
     * @example
     * // Get one Kit_cenov_dev_ewan
     * const kit_cenov_dev_ewan = await prisma.kit_cenov_dev_ewan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends kit_cenov_dev_ewanFindUniqueArgs>(args: SelectSubset<T, kit_cenov_dev_ewanFindUniqueArgs<ExtArgs>>): Prisma__kit_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Kit_cenov_dev_ewan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {kit_cenov_dev_ewanFindUniqueOrThrowArgs} args - Arguments to find a Kit_cenov_dev_ewan
     * @example
     * // Get one Kit_cenov_dev_ewan
     * const kit_cenov_dev_ewan = await prisma.kit_cenov_dev_ewan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends kit_cenov_dev_ewanFindUniqueOrThrowArgs>(args: SelectSubset<T, kit_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__kit_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Kit_cenov_dev_ewan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {kit_cenov_dev_ewanFindFirstArgs} args - Arguments to find a Kit_cenov_dev_ewan
     * @example
     * // Get one Kit_cenov_dev_ewan
     * const kit_cenov_dev_ewan = await prisma.kit_cenov_dev_ewan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends kit_cenov_dev_ewanFindFirstArgs>(args?: SelectSubset<T, kit_cenov_dev_ewanFindFirstArgs<ExtArgs>>): Prisma__kit_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Kit_cenov_dev_ewan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {kit_cenov_dev_ewanFindFirstOrThrowArgs} args - Arguments to find a Kit_cenov_dev_ewan
     * @example
     * // Get one Kit_cenov_dev_ewan
     * const kit_cenov_dev_ewan = await prisma.kit_cenov_dev_ewan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends kit_cenov_dev_ewanFindFirstOrThrowArgs>(args?: SelectSubset<T, kit_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>>): Prisma__kit_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Kit_cenov_dev_ewans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {kit_cenov_dev_ewanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Kit_cenov_dev_ewans
     * const kit_cenov_dev_ewans = await prisma.kit_cenov_dev_ewan.findMany()
     * 
     * // Get first 10 Kit_cenov_dev_ewans
     * const kit_cenov_dev_ewans = await prisma.kit_cenov_dev_ewan.findMany({ take: 10 })
     * 
     * // Only select the `kit_id`
     * const kit_cenov_dev_ewanWithKit_idOnly = await prisma.kit_cenov_dev_ewan.findMany({ select: { kit_id: true } })
     * 
     */
    findMany<T extends kit_cenov_dev_ewanFindManyArgs>(args?: SelectSubset<T, kit_cenov_dev_ewanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Kit_cenov_dev_ewan.
     * @param {kit_cenov_dev_ewanCreateArgs} args - Arguments to create a Kit_cenov_dev_ewan.
     * @example
     * // Create one Kit_cenov_dev_ewan
     * const Kit_cenov_dev_ewan = await prisma.kit_cenov_dev_ewan.create({
     *   data: {
     *     // ... data to create a Kit_cenov_dev_ewan
     *   }
     * })
     * 
     */
    create<T extends kit_cenov_dev_ewanCreateArgs>(args: SelectSubset<T, kit_cenov_dev_ewanCreateArgs<ExtArgs>>): Prisma__kit_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Kit_cenov_dev_ewans.
     * @param {kit_cenov_dev_ewanCreateManyArgs} args - Arguments to create many Kit_cenov_dev_ewans.
     * @example
     * // Create many Kit_cenov_dev_ewans
     * const kit_cenov_dev_ewan = await prisma.kit_cenov_dev_ewan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends kit_cenov_dev_ewanCreateManyArgs>(args?: SelectSubset<T, kit_cenov_dev_ewanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Kit_cenov_dev_ewans and returns the data saved in the database.
     * @param {kit_cenov_dev_ewanCreateManyAndReturnArgs} args - Arguments to create many Kit_cenov_dev_ewans.
     * @example
     * // Create many Kit_cenov_dev_ewans
     * const kit_cenov_dev_ewan = await prisma.kit_cenov_dev_ewan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Kit_cenov_dev_ewans and only return the `kit_id`
     * const kit_cenov_dev_ewanWithKit_idOnly = await prisma.kit_cenov_dev_ewan.createManyAndReturn({
     *   select: { kit_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends kit_cenov_dev_ewanCreateManyAndReturnArgs>(args?: SelectSubset<T, kit_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Kit_cenov_dev_ewan.
     * @param {kit_cenov_dev_ewanDeleteArgs} args - Arguments to delete one Kit_cenov_dev_ewan.
     * @example
     * // Delete one Kit_cenov_dev_ewan
     * const Kit_cenov_dev_ewan = await prisma.kit_cenov_dev_ewan.delete({
     *   where: {
     *     // ... filter to delete one Kit_cenov_dev_ewan
     *   }
     * })
     * 
     */
    delete<T extends kit_cenov_dev_ewanDeleteArgs>(args: SelectSubset<T, kit_cenov_dev_ewanDeleteArgs<ExtArgs>>): Prisma__kit_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Kit_cenov_dev_ewan.
     * @param {kit_cenov_dev_ewanUpdateArgs} args - Arguments to update one Kit_cenov_dev_ewan.
     * @example
     * // Update one Kit_cenov_dev_ewan
     * const kit_cenov_dev_ewan = await prisma.kit_cenov_dev_ewan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends kit_cenov_dev_ewanUpdateArgs>(args: SelectSubset<T, kit_cenov_dev_ewanUpdateArgs<ExtArgs>>): Prisma__kit_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Kit_cenov_dev_ewans.
     * @param {kit_cenov_dev_ewanDeleteManyArgs} args - Arguments to filter Kit_cenov_dev_ewans to delete.
     * @example
     * // Delete a few Kit_cenov_dev_ewans
     * const { count } = await prisma.kit_cenov_dev_ewan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends kit_cenov_dev_ewanDeleteManyArgs>(args?: SelectSubset<T, kit_cenov_dev_ewanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Kit_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {kit_cenov_dev_ewanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Kit_cenov_dev_ewans
     * const kit_cenov_dev_ewan = await prisma.kit_cenov_dev_ewan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends kit_cenov_dev_ewanUpdateManyArgs>(args: SelectSubset<T, kit_cenov_dev_ewanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Kit_cenov_dev_ewans and returns the data updated in the database.
     * @param {kit_cenov_dev_ewanUpdateManyAndReturnArgs} args - Arguments to update many Kit_cenov_dev_ewans.
     * @example
     * // Update many Kit_cenov_dev_ewans
     * const kit_cenov_dev_ewan = await prisma.kit_cenov_dev_ewan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Kit_cenov_dev_ewans and only return the `kit_id`
     * const kit_cenov_dev_ewanWithKit_idOnly = await prisma.kit_cenov_dev_ewan.updateManyAndReturn({
     *   select: { kit_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends kit_cenov_dev_ewanUpdateManyAndReturnArgs>(args: SelectSubset<T, kit_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Kit_cenov_dev_ewan.
     * @param {kit_cenov_dev_ewanUpsertArgs} args - Arguments to update or create a Kit_cenov_dev_ewan.
     * @example
     * // Update or create a Kit_cenov_dev_ewan
     * const kit_cenov_dev_ewan = await prisma.kit_cenov_dev_ewan.upsert({
     *   create: {
     *     // ... data to create a Kit_cenov_dev_ewan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Kit_cenov_dev_ewan we want to update
     *   }
     * })
     */
    upsert<T extends kit_cenov_dev_ewanUpsertArgs>(args: SelectSubset<T, kit_cenov_dev_ewanUpsertArgs<ExtArgs>>): Prisma__kit_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Kit_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {kit_cenov_dev_ewanCountArgs} args - Arguments to filter Kit_cenov_dev_ewans to count.
     * @example
     * // Count the number of Kit_cenov_dev_ewans
     * const count = await prisma.kit_cenov_dev_ewan.count({
     *   where: {
     *     // ... the filter for the Kit_cenov_dev_ewans we want to count
     *   }
     * })
    **/
    count<T extends kit_cenov_dev_ewanCountArgs>(
      args?: Subset<T, kit_cenov_dev_ewanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Kit_cenov_dev_ewanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Kit_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Kit_cenov_dev_ewanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Kit_cenov_dev_ewanAggregateArgs>(args: Subset<T, Kit_cenov_dev_ewanAggregateArgs>): Prisma.PrismaPromise<GetKit_cenov_dev_ewanAggregateType<T>>

    /**
     * Group by Kit_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {kit_cenov_dev_ewanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends kit_cenov_dev_ewanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: kit_cenov_dev_ewanGroupByArgs['orderBy'] }
        : { orderBy?: kit_cenov_dev_ewanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, kit_cenov_dev_ewanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKit_cenov_dev_ewanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the kit_cenov_dev_ewan model
   */
  readonly fields: kit_cenov_dev_ewanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for kit_cenov_dev_ewan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__kit_cenov_dev_ewanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    produit<T extends kit_cenov_dev_ewan$produitArgs<ExtArgs> = {}>(args?: Subset<T, kit_cenov_dev_ewan$produitArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$produitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    kit_attribute<T extends kit_cenov_dev_ewan$kit_attributeArgs<ExtArgs> = {}>(args?: Subset<T, kit_cenov_dev_ewan$kit_attributeArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    part_nc<T extends kit_cenov_dev_ewan$part_ncArgs<ExtArgs> = {}>(args?: Subset<T, kit_cenov_dev_ewan$part_ncArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the kit_cenov_dev_ewan model
   */
  interface kit_cenov_dev_ewanFieldRefs {
    readonly kit_id: FieldRef<"kit_cenov_dev_ewan", 'Int'>
    readonly kit_label: FieldRef<"kit_cenov_dev_ewan", 'String'>
    readonly created_at: FieldRef<"kit_cenov_dev_ewan", 'DateTime'>
    readonly updated_at: FieldRef<"kit_cenov_dev_ewan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * kit_cenov_dev_ewan findUnique
   */
  export type kit_cenov_dev_ewanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which kit_cenov_dev_ewan to fetch.
     */
    where: kit_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * kit_cenov_dev_ewan findUniqueOrThrow
   */
  export type kit_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which kit_cenov_dev_ewan to fetch.
     */
    where: kit_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * kit_cenov_dev_ewan findFirst
   */
  export type kit_cenov_dev_ewanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which kit_cenov_dev_ewan to fetch.
     */
    where?: kit_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of kit_cenov_dev_ewans to fetch.
     */
    orderBy?: kit_cenov_dev_ewanOrderByWithRelationInput | kit_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for kit_cenov_dev_ewans.
     */
    cursor?: kit_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` kit_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` kit_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of kit_cenov_dev_ewans.
     */
    distinct?: Kit_cenov_dev_ewanScalarFieldEnum | Kit_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * kit_cenov_dev_ewan findFirstOrThrow
   */
  export type kit_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which kit_cenov_dev_ewan to fetch.
     */
    where?: kit_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of kit_cenov_dev_ewans to fetch.
     */
    orderBy?: kit_cenov_dev_ewanOrderByWithRelationInput | kit_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for kit_cenov_dev_ewans.
     */
    cursor?: kit_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` kit_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` kit_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of kit_cenov_dev_ewans.
     */
    distinct?: Kit_cenov_dev_ewanScalarFieldEnum | Kit_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * kit_cenov_dev_ewan findMany
   */
  export type kit_cenov_dev_ewanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which kit_cenov_dev_ewans to fetch.
     */
    where?: kit_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of kit_cenov_dev_ewans to fetch.
     */
    orderBy?: kit_cenov_dev_ewanOrderByWithRelationInput | kit_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing kit_cenov_dev_ewans.
     */
    cursor?: kit_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` kit_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` kit_cenov_dev_ewans.
     */
    skip?: number
    distinct?: Kit_cenov_dev_ewanScalarFieldEnum | Kit_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * kit_cenov_dev_ewan create
   */
  export type kit_cenov_dev_ewanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to create a kit_cenov_dev_ewan.
     */
    data?: XOR<kit_cenov_dev_ewanCreateInput, kit_cenov_dev_ewanUncheckedCreateInput>
  }

  /**
   * kit_cenov_dev_ewan createMany
   */
  export type kit_cenov_dev_ewanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many kit_cenov_dev_ewans.
     */
    data: kit_cenov_dev_ewanCreateManyInput | kit_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * kit_cenov_dev_ewan createManyAndReturn
   */
  export type kit_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to create many kit_cenov_dev_ewans.
     */
    data: kit_cenov_dev_ewanCreateManyInput | kit_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * kit_cenov_dev_ewan update
   */
  export type kit_cenov_dev_ewanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to update a kit_cenov_dev_ewan.
     */
    data: XOR<kit_cenov_dev_ewanUpdateInput, kit_cenov_dev_ewanUncheckedUpdateInput>
    /**
     * Choose, which kit_cenov_dev_ewan to update.
     */
    where: kit_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * kit_cenov_dev_ewan updateMany
   */
  export type kit_cenov_dev_ewanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update kit_cenov_dev_ewans.
     */
    data: XOR<kit_cenov_dev_ewanUpdateManyMutationInput, kit_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which kit_cenov_dev_ewans to update
     */
    where?: kit_cenov_dev_ewanWhereInput
    /**
     * Limit how many kit_cenov_dev_ewans to update.
     */
    limit?: number
  }

  /**
   * kit_cenov_dev_ewan updateManyAndReturn
   */
  export type kit_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to update kit_cenov_dev_ewans.
     */
    data: XOR<kit_cenov_dev_ewanUpdateManyMutationInput, kit_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which kit_cenov_dev_ewans to update
     */
    where?: kit_cenov_dev_ewanWhereInput
    /**
     * Limit how many kit_cenov_dev_ewans to update.
     */
    limit?: number
  }

  /**
   * kit_cenov_dev_ewan upsert
   */
  export type kit_cenov_dev_ewanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The filter to search for the kit_cenov_dev_ewan to update in case it exists.
     */
    where: kit_cenov_dev_ewanWhereUniqueInput
    /**
     * In case the kit_cenov_dev_ewan found by the `where` argument doesn't exist, create a new kit_cenov_dev_ewan with this data.
     */
    create: XOR<kit_cenov_dev_ewanCreateInput, kit_cenov_dev_ewanUncheckedCreateInput>
    /**
     * In case the kit_cenov_dev_ewan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<kit_cenov_dev_ewanUpdateInput, kit_cenov_dev_ewanUncheckedUpdateInput>
  }

  /**
   * kit_cenov_dev_ewan delete
   */
  export type kit_cenov_dev_ewanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter which kit_cenov_dev_ewan to delete.
     */
    where: kit_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * kit_cenov_dev_ewan deleteMany
   */
  export type kit_cenov_dev_ewanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which kit_cenov_dev_ewans to delete
     */
    where?: kit_cenov_dev_ewanWhereInput
    /**
     * Limit how many kit_cenov_dev_ewans to delete.
     */
    limit?: number
  }

  /**
   * kit_cenov_dev_ewan.produit
   */
  export type kit_cenov_dev_ewan$produitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the produit
     */
    select?: produitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the produit
     */
    omit?: produitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: produitInclude<ExtArgs> | null
    where?: produitWhereInput
    orderBy?: produitOrderByWithRelationInput | produitOrderByWithRelationInput[]
    cursor?: produitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProduitScalarFieldEnum | ProduitScalarFieldEnum[]
  }

  /**
   * kit_cenov_dev_ewan.kit_attribute
   */
  export type kit_cenov_dev_ewan$kit_attributeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
    where?: kit_attribute_cenov_dev_ewanWhereInput
    orderBy?: kit_attribute_cenov_dev_ewanOrderByWithRelationInput | kit_attribute_cenov_dev_ewanOrderByWithRelationInput[]
    cursor?: kit_attribute_cenov_dev_ewanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Kit_attribute_cenov_dev_ewanScalarFieldEnum | Kit_attribute_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * kit_cenov_dev_ewan.part_nc
   */
  export type kit_cenov_dev_ewan$part_ncArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanInclude<ExtArgs> | null
    where?: part_nc_cenov_dev_ewanWhereInput
    orderBy?: part_nc_cenov_dev_ewanOrderByWithRelationInput | part_nc_cenov_dev_ewanOrderByWithRelationInput[]
    cursor?: part_nc_cenov_dev_ewanWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Part_nc_cenov_dev_ewanScalarFieldEnum | Part_nc_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * kit_cenov_dev_ewan without action
   */
  export type kit_cenov_dev_ewanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
  }


  /**
   * Model kit_attribute_cenov_dev_ewan
   */

  export type AggregateKit_attribute_cenov_dev_ewan = {
    _count: Kit_attribute_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Kit_attribute_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Kit_attribute_cenov_dev_ewanSumAggregateOutputType | null
    _min: Kit_attribute_cenov_dev_ewanMinAggregateOutputType | null
    _max: Kit_attribute_cenov_dev_ewanMaxAggregateOutputType | null
  }

  export type Kit_attribute_cenov_dev_ewanAvgAggregateOutputType = {
    fk_kit: number | null
    fk_attribute_carac: number | null
    fk_attribute_unit: number | null
    kat_id: number | null
  }

  export type Kit_attribute_cenov_dev_ewanSumAggregateOutputType = {
    fk_kit: number | null
    fk_attribute_carac: number | null
    fk_attribute_unit: number | null
    kat_id: number | null
  }

  export type Kit_attribute_cenov_dev_ewanMinAggregateOutputType = {
    fk_kit: number | null
    fk_attribute_carac: number | null
    fk_attribute_unit: number | null
    kat_valeur: string | null
    created_at: Date | null
    updated_at: Date | null
    kat_id: number | null
  }

  export type Kit_attribute_cenov_dev_ewanMaxAggregateOutputType = {
    fk_kit: number | null
    fk_attribute_carac: number | null
    fk_attribute_unit: number | null
    kat_valeur: string | null
    created_at: Date | null
    updated_at: Date | null
    kat_id: number | null
  }

  export type Kit_attribute_cenov_dev_ewanCountAggregateOutputType = {
    fk_kit: number
    fk_attribute_carac: number
    fk_attribute_unit: number
    kat_valeur: number
    created_at: number
    updated_at: number
    kat_id: number
    _all: number
  }


  export type Kit_attribute_cenov_dev_ewanAvgAggregateInputType = {
    fk_kit?: true
    fk_attribute_carac?: true
    fk_attribute_unit?: true
    kat_id?: true
  }

  export type Kit_attribute_cenov_dev_ewanSumAggregateInputType = {
    fk_kit?: true
    fk_attribute_carac?: true
    fk_attribute_unit?: true
    kat_id?: true
  }

  export type Kit_attribute_cenov_dev_ewanMinAggregateInputType = {
    fk_kit?: true
    fk_attribute_carac?: true
    fk_attribute_unit?: true
    kat_valeur?: true
    created_at?: true
    updated_at?: true
    kat_id?: true
  }

  export type Kit_attribute_cenov_dev_ewanMaxAggregateInputType = {
    fk_kit?: true
    fk_attribute_carac?: true
    fk_attribute_unit?: true
    kat_valeur?: true
    created_at?: true
    updated_at?: true
    kat_id?: true
  }

  export type Kit_attribute_cenov_dev_ewanCountAggregateInputType = {
    fk_kit?: true
    fk_attribute_carac?: true
    fk_attribute_unit?: true
    kat_valeur?: true
    created_at?: true
    updated_at?: true
    kat_id?: true
    _all?: true
  }

  export type Kit_attribute_cenov_dev_ewanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which kit_attribute_cenov_dev_ewan to aggregate.
     */
    where?: kit_attribute_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of kit_attribute_cenov_dev_ewans to fetch.
     */
    orderBy?: kit_attribute_cenov_dev_ewanOrderByWithRelationInput | kit_attribute_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: kit_attribute_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` kit_attribute_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` kit_attribute_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned kit_attribute_cenov_dev_ewans
    **/
    _count?: true | Kit_attribute_cenov_dev_ewanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Kit_attribute_cenov_dev_ewanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Kit_attribute_cenov_dev_ewanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Kit_attribute_cenov_dev_ewanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Kit_attribute_cenov_dev_ewanMaxAggregateInputType
  }

  export type GetKit_attribute_cenov_dev_ewanAggregateType<T extends Kit_attribute_cenov_dev_ewanAggregateArgs> = {
        [P in keyof T & keyof AggregateKit_attribute_cenov_dev_ewan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKit_attribute_cenov_dev_ewan[P]>
      : GetScalarType<T[P], AggregateKit_attribute_cenov_dev_ewan[P]>
  }




  export type kit_attribute_cenov_dev_ewanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: kit_attribute_cenov_dev_ewanWhereInput
    orderBy?: kit_attribute_cenov_dev_ewanOrderByWithAggregationInput | kit_attribute_cenov_dev_ewanOrderByWithAggregationInput[]
    by: Kit_attribute_cenov_dev_ewanScalarFieldEnum[] | Kit_attribute_cenov_dev_ewanScalarFieldEnum
    having?: kit_attribute_cenov_dev_ewanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Kit_attribute_cenov_dev_ewanCountAggregateInputType | true
    _avg?: Kit_attribute_cenov_dev_ewanAvgAggregateInputType
    _sum?: Kit_attribute_cenov_dev_ewanSumAggregateInputType
    _min?: Kit_attribute_cenov_dev_ewanMinAggregateInputType
    _max?: Kit_attribute_cenov_dev_ewanMaxAggregateInputType
  }

  export type Kit_attribute_cenov_dev_ewanGroupByOutputType = {
    fk_kit: number | null
    fk_attribute_carac: number | null
    fk_attribute_unit: number | null
    kat_valeur: string | null
    created_at: Date | null
    updated_at: Date | null
    kat_id: number
    _count: Kit_attribute_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Kit_attribute_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Kit_attribute_cenov_dev_ewanSumAggregateOutputType | null
    _min: Kit_attribute_cenov_dev_ewanMinAggregateOutputType | null
    _max: Kit_attribute_cenov_dev_ewanMaxAggregateOutputType | null
  }

  type GetKit_attribute_cenov_dev_ewanGroupByPayload<T extends kit_attribute_cenov_dev_ewanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Kit_attribute_cenov_dev_ewanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Kit_attribute_cenov_dev_ewanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Kit_attribute_cenov_dev_ewanGroupByOutputType[P]>
            : GetScalarType<T[P], Kit_attribute_cenov_dev_ewanGroupByOutputType[P]>
        }
      >
    >


  export type kit_attribute_cenov_dev_ewanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fk_kit?: boolean
    fk_attribute_carac?: boolean
    fk_attribute_unit?: boolean
    kat_valeur?: boolean
    created_at?: boolean
    updated_at?: boolean
    kat_id?: boolean
    attribut_kit_attribute_fk_attribute_caracToattribut?: boolean | kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs>
    attribut_kit_attribute_fk_attribute_unitToattribut?: boolean | kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs>
    kit?: boolean | kit_attribute_cenov_dev_ewan$kitArgs<ExtArgs>
  }, ExtArgs["result"]["kit_attribute_cenov_dev_ewan"]>

  export type kit_attribute_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fk_kit?: boolean
    fk_attribute_carac?: boolean
    fk_attribute_unit?: boolean
    kat_valeur?: boolean
    created_at?: boolean
    updated_at?: boolean
    kat_id?: boolean
    attribut_kit_attribute_fk_attribute_caracToattribut?: boolean | kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs>
    attribut_kit_attribute_fk_attribute_unitToattribut?: boolean | kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs>
    kit?: boolean | kit_attribute_cenov_dev_ewan$kitArgs<ExtArgs>
  }, ExtArgs["result"]["kit_attribute_cenov_dev_ewan"]>

  export type kit_attribute_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fk_kit?: boolean
    fk_attribute_carac?: boolean
    fk_attribute_unit?: boolean
    kat_valeur?: boolean
    created_at?: boolean
    updated_at?: boolean
    kat_id?: boolean
    attribut_kit_attribute_fk_attribute_caracToattribut?: boolean | kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs>
    attribut_kit_attribute_fk_attribute_unitToattribut?: boolean | kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs>
    kit?: boolean | kit_attribute_cenov_dev_ewan$kitArgs<ExtArgs>
  }, ExtArgs["result"]["kit_attribute_cenov_dev_ewan"]>

  export type kit_attribute_cenov_dev_ewanSelectScalar = {
    fk_kit?: boolean
    fk_attribute_carac?: boolean
    fk_attribute_unit?: boolean
    kat_valeur?: boolean
    created_at?: boolean
    updated_at?: boolean
    kat_id?: boolean
  }

  export type kit_attribute_cenov_dev_ewanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"fk_kit" | "fk_attribute_carac" | "fk_attribute_unit" | "kat_valeur" | "created_at" | "updated_at" | "kat_id", ExtArgs["result"]["kit_attribute_cenov_dev_ewan"]>
  export type kit_attribute_cenov_dev_ewanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attribut_kit_attribute_fk_attribute_caracToattribut?: boolean | kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs>
    attribut_kit_attribute_fk_attribute_unitToattribut?: boolean | kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs>
    kit?: boolean | kit_attribute_cenov_dev_ewan$kitArgs<ExtArgs>
  }
  export type kit_attribute_cenov_dev_ewanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attribut_kit_attribute_fk_attribute_caracToattribut?: boolean | kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs>
    attribut_kit_attribute_fk_attribute_unitToattribut?: boolean | kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs>
    kit?: boolean | kit_attribute_cenov_dev_ewan$kitArgs<ExtArgs>
  }
  export type kit_attribute_cenov_dev_ewanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attribut_kit_attribute_fk_attribute_caracToattribut?: boolean | kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs>
    attribut_kit_attribute_fk_attribute_unitToattribut?: boolean | kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs>
    kit?: boolean | kit_attribute_cenov_dev_ewan$kitArgs<ExtArgs>
  }

  export type $kit_attribute_cenov_dev_ewanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "kit_attribute_cenov_dev_ewan"
    objects: {
      attribut_kit_attribute_fk_attribute_caracToattribut: Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs> | null
      attribut_kit_attribute_fk_attribute_unitToattribut: Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs> | null
      kit: Prisma.$kit_cenov_dev_ewanPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      fk_kit: number | null
      fk_attribute_carac: number | null
      fk_attribute_unit: number | null
      kat_valeur: string | null
      created_at: Date | null
      updated_at: Date | null
      kat_id: number
    }, ExtArgs["result"]["kit_attribute_cenov_dev_ewan"]>
    composites: {}
  }

  type kit_attribute_cenov_dev_ewanGetPayload<S extends boolean | null | undefined | kit_attribute_cenov_dev_ewanDefaultArgs> = $Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload, S>

  type kit_attribute_cenov_dev_ewanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<kit_attribute_cenov_dev_ewanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Kit_attribute_cenov_dev_ewanCountAggregateInputType | true
    }

  export interface kit_attribute_cenov_dev_ewanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['kit_attribute_cenov_dev_ewan'], meta: { name: 'kit_attribute_cenov_dev_ewan' } }
    /**
     * Find zero or one Kit_attribute_cenov_dev_ewan that matches the filter.
     * @param {kit_attribute_cenov_dev_ewanFindUniqueArgs} args - Arguments to find a Kit_attribute_cenov_dev_ewan
     * @example
     * // Get one Kit_attribute_cenov_dev_ewan
     * const kit_attribute_cenov_dev_ewan = await prisma.kit_attribute_cenov_dev_ewan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends kit_attribute_cenov_dev_ewanFindUniqueArgs>(args: SelectSubset<T, kit_attribute_cenov_dev_ewanFindUniqueArgs<ExtArgs>>): Prisma__kit_attribute_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Kit_attribute_cenov_dev_ewan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {kit_attribute_cenov_dev_ewanFindUniqueOrThrowArgs} args - Arguments to find a Kit_attribute_cenov_dev_ewan
     * @example
     * // Get one Kit_attribute_cenov_dev_ewan
     * const kit_attribute_cenov_dev_ewan = await prisma.kit_attribute_cenov_dev_ewan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends kit_attribute_cenov_dev_ewanFindUniqueOrThrowArgs>(args: SelectSubset<T, kit_attribute_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__kit_attribute_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Kit_attribute_cenov_dev_ewan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {kit_attribute_cenov_dev_ewanFindFirstArgs} args - Arguments to find a Kit_attribute_cenov_dev_ewan
     * @example
     * // Get one Kit_attribute_cenov_dev_ewan
     * const kit_attribute_cenov_dev_ewan = await prisma.kit_attribute_cenov_dev_ewan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends kit_attribute_cenov_dev_ewanFindFirstArgs>(args?: SelectSubset<T, kit_attribute_cenov_dev_ewanFindFirstArgs<ExtArgs>>): Prisma__kit_attribute_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Kit_attribute_cenov_dev_ewan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {kit_attribute_cenov_dev_ewanFindFirstOrThrowArgs} args - Arguments to find a Kit_attribute_cenov_dev_ewan
     * @example
     * // Get one Kit_attribute_cenov_dev_ewan
     * const kit_attribute_cenov_dev_ewan = await prisma.kit_attribute_cenov_dev_ewan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends kit_attribute_cenov_dev_ewanFindFirstOrThrowArgs>(args?: SelectSubset<T, kit_attribute_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>>): Prisma__kit_attribute_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Kit_attribute_cenov_dev_ewans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {kit_attribute_cenov_dev_ewanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Kit_attribute_cenov_dev_ewans
     * const kit_attribute_cenov_dev_ewans = await prisma.kit_attribute_cenov_dev_ewan.findMany()
     * 
     * // Get first 10 Kit_attribute_cenov_dev_ewans
     * const kit_attribute_cenov_dev_ewans = await prisma.kit_attribute_cenov_dev_ewan.findMany({ take: 10 })
     * 
     * // Only select the `fk_kit`
     * const kit_attribute_cenov_dev_ewanWithFk_kitOnly = await prisma.kit_attribute_cenov_dev_ewan.findMany({ select: { fk_kit: true } })
     * 
     */
    findMany<T extends kit_attribute_cenov_dev_ewanFindManyArgs>(args?: SelectSubset<T, kit_attribute_cenov_dev_ewanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Kit_attribute_cenov_dev_ewan.
     * @param {kit_attribute_cenov_dev_ewanCreateArgs} args - Arguments to create a Kit_attribute_cenov_dev_ewan.
     * @example
     * // Create one Kit_attribute_cenov_dev_ewan
     * const Kit_attribute_cenov_dev_ewan = await prisma.kit_attribute_cenov_dev_ewan.create({
     *   data: {
     *     // ... data to create a Kit_attribute_cenov_dev_ewan
     *   }
     * })
     * 
     */
    create<T extends kit_attribute_cenov_dev_ewanCreateArgs>(args: SelectSubset<T, kit_attribute_cenov_dev_ewanCreateArgs<ExtArgs>>): Prisma__kit_attribute_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Kit_attribute_cenov_dev_ewans.
     * @param {kit_attribute_cenov_dev_ewanCreateManyArgs} args - Arguments to create many Kit_attribute_cenov_dev_ewans.
     * @example
     * // Create many Kit_attribute_cenov_dev_ewans
     * const kit_attribute_cenov_dev_ewan = await prisma.kit_attribute_cenov_dev_ewan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends kit_attribute_cenov_dev_ewanCreateManyArgs>(args?: SelectSubset<T, kit_attribute_cenov_dev_ewanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Kit_attribute_cenov_dev_ewans and returns the data saved in the database.
     * @param {kit_attribute_cenov_dev_ewanCreateManyAndReturnArgs} args - Arguments to create many Kit_attribute_cenov_dev_ewans.
     * @example
     * // Create many Kit_attribute_cenov_dev_ewans
     * const kit_attribute_cenov_dev_ewan = await prisma.kit_attribute_cenov_dev_ewan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Kit_attribute_cenov_dev_ewans and only return the `fk_kit`
     * const kit_attribute_cenov_dev_ewanWithFk_kitOnly = await prisma.kit_attribute_cenov_dev_ewan.createManyAndReturn({
     *   select: { fk_kit: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends kit_attribute_cenov_dev_ewanCreateManyAndReturnArgs>(args?: SelectSubset<T, kit_attribute_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Kit_attribute_cenov_dev_ewan.
     * @param {kit_attribute_cenov_dev_ewanDeleteArgs} args - Arguments to delete one Kit_attribute_cenov_dev_ewan.
     * @example
     * // Delete one Kit_attribute_cenov_dev_ewan
     * const Kit_attribute_cenov_dev_ewan = await prisma.kit_attribute_cenov_dev_ewan.delete({
     *   where: {
     *     // ... filter to delete one Kit_attribute_cenov_dev_ewan
     *   }
     * })
     * 
     */
    delete<T extends kit_attribute_cenov_dev_ewanDeleteArgs>(args: SelectSubset<T, kit_attribute_cenov_dev_ewanDeleteArgs<ExtArgs>>): Prisma__kit_attribute_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Kit_attribute_cenov_dev_ewan.
     * @param {kit_attribute_cenov_dev_ewanUpdateArgs} args - Arguments to update one Kit_attribute_cenov_dev_ewan.
     * @example
     * // Update one Kit_attribute_cenov_dev_ewan
     * const kit_attribute_cenov_dev_ewan = await prisma.kit_attribute_cenov_dev_ewan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends kit_attribute_cenov_dev_ewanUpdateArgs>(args: SelectSubset<T, kit_attribute_cenov_dev_ewanUpdateArgs<ExtArgs>>): Prisma__kit_attribute_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Kit_attribute_cenov_dev_ewans.
     * @param {kit_attribute_cenov_dev_ewanDeleteManyArgs} args - Arguments to filter Kit_attribute_cenov_dev_ewans to delete.
     * @example
     * // Delete a few Kit_attribute_cenov_dev_ewans
     * const { count } = await prisma.kit_attribute_cenov_dev_ewan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends kit_attribute_cenov_dev_ewanDeleteManyArgs>(args?: SelectSubset<T, kit_attribute_cenov_dev_ewanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Kit_attribute_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {kit_attribute_cenov_dev_ewanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Kit_attribute_cenov_dev_ewans
     * const kit_attribute_cenov_dev_ewan = await prisma.kit_attribute_cenov_dev_ewan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends kit_attribute_cenov_dev_ewanUpdateManyArgs>(args: SelectSubset<T, kit_attribute_cenov_dev_ewanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Kit_attribute_cenov_dev_ewans and returns the data updated in the database.
     * @param {kit_attribute_cenov_dev_ewanUpdateManyAndReturnArgs} args - Arguments to update many Kit_attribute_cenov_dev_ewans.
     * @example
     * // Update many Kit_attribute_cenov_dev_ewans
     * const kit_attribute_cenov_dev_ewan = await prisma.kit_attribute_cenov_dev_ewan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Kit_attribute_cenov_dev_ewans and only return the `fk_kit`
     * const kit_attribute_cenov_dev_ewanWithFk_kitOnly = await prisma.kit_attribute_cenov_dev_ewan.updateManyAndReturn({
     *   select: { fk_kit: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends kit_attribute_cenov_dev_ewanUpdateManyAndReturnArgs>(args: SelectSubset<T, kit_attribute_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Kit_attribute_cenov_dev_ewan.
     * @param {kit_attribute_cenov_dev_ewanUpsertArgs} args - Arguments to update or create a Kit_attribute_cenov_dev_ewan.
     * @example
     * // Update or create a Kit_attribute_cenov_dev_ewan
     * const kit_attribute_cenov_dev_ewan = await prisma.kit_attribute_cenov_dev_ewan.upsert({
     *   create: {
     *     // ... data to create a Kit_attribute_cenov_dev_ewan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Kit_attribute_cenov_dev_ewan we want to update
     *   }
     * })
     */
    upsert<T extends kit_attribute_cenov_dev_ewanUpsertArgs>(args: SelectSubset<T, kit_attribute_cenov_dev_ewanUpsertArgs<ExtArgs>>): Prisma__kit_attribute_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_attribute_cenov_dev_ewanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Kit_attribute_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {kit_attribute_cenov_dev_ewanCountArgs} args - Arguments to filter Kit_attribute_cenov_dev_ewans to count.
     * @example
     * // Count the number of Kit_attribute_cenov_dev_ewans
     * const count = await prisma.kit_attribute_cenov_dev_ewan.count({
     *   where: {
     *     // ... the filter for the Kit_attribute_cenov_dev_ewans we want to count
     *   }
     * })
    **/
    count<T extends kit_attribute_cenov_dev_ewanCountArgs>(
      args?: Subset<T, kit_attribute_cenov_dev_ewanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Kit_attribute_cenov_dev_ewanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Kit_attribute_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Kit_attribute_cenov_dev_ewanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Kit_attribute_cenov_dev_ewanAggregateArgs>(args: Subset<T, Kit_attribute_cenov_dev_ewanAggregateArgs>): Prisma.PrismaPromise<GetKit_attribute_cenov_dev_ewanAggregateType<T>>

    /**
     * Group by Kit_attribute_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {kit_attribute_cenov_dev_ewanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends kit_attribute_cenov_dev_ewanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: kit_attribute_cenov_dev_ewanGroupByArgs['orderBy'] }
        : { orderBy?: kit_attribute_cenov_dev_ewanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, kit_attribute_cenov_dev_ewanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKit_attribute_cenov_dev_ewanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the kit_attribute_cenov_dev_ewan model
   */
  readonly fields: kit_attribute_cenov_dev_ewanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for kit_attribute_cenov_dev_ewan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__kit_attribute_cenov_dev_ewanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    attribut_kit_attribute_fk_attribute_caracToattribut<T extends kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs> = {}>(args?: Subset<T, kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs>>): Prisma__attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    attribut_kit_attribute_fk_attribute_unitToattribut<T extends kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs> = {}>(args?: Subset<T, kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs>>): Prisma__attribut_cenov_dev_ewanClient<$Result.GetResult<Prisma.$attribut_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    kit<T extends kit_attribute_cenov_dev_ewan$kitArgs<ExtArgs> = {}>(args?: Subset<T, kit_attribute_cenov_dev_ewan$kitArgs<ExtArgs>>): Prisma__kit_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the kit_attribute_cenov_dev_ewan model
   */
  interface kit_attribute_cenov_dev_ewanFieldRefs {
    readonly fk_kit: FieldRef<"kit_attribute_cenov_dev_ewan", 'Int'>
    readonly fk_attribute_carac: FieldRef<"kit_attribute_cenov_dev_ewan", 'Int'>
    readonly fk_attribute_unit: FieldRef<"kit_attribute_cenov_dev_ewan", 'Int'>
    readonly kat_valeur: FieldRef<"kit_attribute_cenov_dev_ewan", 'String'>
    readonly created_at: FieldRef<"kit_attribute_cenov_dev_ewan", 'DateTime'>
    readonly updated_at: FieldRef<"kit_attribute_cenov_dev_ewan", 'DateTime'>
    readonly kat_id: FieldRef<"kit_attribute_cenov_dev_ewan", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * kit_attribute_cenov_dev_ewan findUnique
   */
  export type kit_attribute_cenov_dev_ewanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which kit_attribute_cenov_dev_ewan to fetch.
     */
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * kit_attribute_cenov_dev_ewan findUniqueOrThrow
   */
  export type kit_attribute_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which kit_attribute_cenov_dev_ewan to fetch.
     */
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * kit_attribute_cenov_dev_ewan findFirst
   */
  export type kit_attribute_cenov_dev_ewanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which kit_attribute_cenov_dev_ewan to fetch.
     */
    where?: kit_attribute_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of kit_attribute_cenov_dev_ewans to fetch.
     */
    orderBy?: kit_attribute_cenov_dev_ewanOrderByWithRelationInput | kit_attribute_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for kit_attribute_cenov_dev_ewans.
     */
    cursor?: kit_attribute_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` kit_attribute_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` kit_attribute_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of kit_attribute_cenov_dev_ewans.
     */
    distinct?: Kit_attribute_cenov_dev_ewanScalarFieldEnum | Kit_attribute_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * kit_attribute_cenov_dev_ewan findFirstOrThrow
   */
  export type kit_attribute_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which kit_attribute_cenov_dev_ewan to fetch.
     */
    where?: kit_attribute_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of kit_attribute_cenov_dev_ewans to fetch.
     */
    orderBy?: kit_attribute_cenov_dev_ewanOrderByWithRelationInput | kit_attribute_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for kit_attribute_cenov_dev_ewans.
     */
    cursor?: kit_attribute_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` kit_attribute_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` kit_attribute_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of kit_attribute_cenov_dev_ewans.
     */
    distinct?: Kit_attribute_cenov_dev_ewanScalarFieldEnum | Kit_attribute_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * kit_attribute_cenov_dev_ewan findMany
   */
  export type kit_attribute_cenov_dev_ewanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which kit_attribute_cenov_dev_ewans to fetch.
     */
    where?: kit_attribute_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of kit_attribute_cenov_dev_ewans to fetch.
     */
    orderBy?: kit_attribute_cenov_dev_ewanOrderByWithRelationInput | kit_attribute_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing kit_attribute_cenov_dev_ewans.
     */
    cursor?: kit_attribute_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` kit_attribute_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` kit_attribute_cenov_dev_ewans.
     */
    skip?: number
    distinct?: Kit_attribute_cenov_dev_ewanScalarFieldEnum | Kit_attribute_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * kit_attribute_cenov_dev_ewan create
   */
  export type kit_attribute_cenov_dev_ewanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to create a kit_attribute_cenov_dev_ewan.
     */
    data?: XOR<kit_attribute_cenov_dev_ewanCreateInput, kit_attribute_cenov_dev_ewanUncheckedCreateInput>
  }

  /**
   * kit_attribute_cenov_dev_ewan createMany
   */
  export type kit_attribute_cenov_dev_ewanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many kit_attribute_cenov_dev_ewans.
     */
    data: kit_attribute_cenov_dev_ewanCreateManyInput | kit_attribute_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * kit_attribute_cenov_dev_ewan createManyAndReturn
   */
  export type kit_attribute_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to create many kit_attribute_cenov_dev_ewans.
     */
    data: kit_attribute_cenov_dev_ewanCreateManyInput | kit_attribute_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * kit_attribute_cenov_dev_ewan update
   */
  export type kit_attribute_cenov_dev_ewanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to update a kit_attribute_cenov_dev_ewan.
     */
    data: XOR<kit_attribute_cenov_dev_ewanUpdateInput, kit_attribute_cenov_dev_ewanUncheckedUpdateInput>
    /**
     * Choose, which kit_attribute_cenov_dev_ewan to update.
     */
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * kit_attribute_cenov_dev_ewan updateMany
   */
  export type kit_attribute_cenov_dev_ewanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update kit_attribute_cenov_dev_ewans.
     */
    data: XOR<kit_attribute_cenov_dev_ewanUpdateManyMutationInput, kit_attribute_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which kit_attribute_cenov_dev_ewans to update
     */
    where?: kit_attribute_cenov_dev_ewanWhereInput
    /**
     * Limit how many kit_attribute_cenov_dev_ewans to update.
     */
    limit?: number
  }

  /**
   * kit_attribute_cenov_dev_ewan updateManyAndReturn
   */
  export type kit_attribute_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to update kit_attribute_cenov_dev_ewans.
     */
    data: XOR<kit_attribute_cenov_dev_ewanUpdateManyMutationInput, kit_attribute_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which kit_attribute_cenov_dev_ewans to update
     */
    where?: kit_attribute_cenov_dev_ewanWhereInput
    /**
     * Limit how many kit_attribute_cenov_dev_ewans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * kit_attribute_cenov_dev_ewan upsert
   */
  export type kit_attribute_cenov_dev_ewanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The filter to search for the kit_attribute_cenov_dev_ewan to update in case it exists.
     */
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
    /**
     * In case the kit_attribute_cenov_dev_ewan found by the `where` argument doesn't exist, create a new kit_attribute_cenov_dev_ewan with this data.
     */
    create: XOR<kit_attribute_cenov_dev_ewanCreateInput, kit_attribute_cenov_dev_ewanUncheckedCreateInput>
    /**
     * In case the kit_attribute_cenov_dev_ewan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<kit_attribute_cenov_dev_ewanUpdateInput, kit_attribute_cenov_dev_ewanUncheckedUpdateInput>
  }

  /**
   * kit_attribute_cenov_dev_ewan delete
   */
  export type kit_attribute_cenov_dev_ewanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter which kit_attribute_cenov_dev_ewan to delete.
     */
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * kit_attribute_cenov_dev_ewan deleteMany
   */
  export type kit_attribute_cenov_dev_ewanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which kit_attribute_cenov_dev_ewans to delete
     */
    where?: kit_attribute_cenov_dev_ewanWhereInput
    /**
     * Limit how many kit_attribute_cenov_dev_ewans to delete.
     */
    limit?: number
  }

  /**
   * kit_attribute_cenov_dev_ewan.attribut_kit_attribute_fk_attribute_caracToattribut
   */
  export type kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_caracToattributArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: attribut_cenov_dev_ewanInclude<ExtArgs> | null
    where?: attribut_cenov_dev_ewanWhereInput
  }

  /**
   * kit_attribute_cenov_dev_ewan.attribut_kit_attribute_fk_attribute_unitToattribut
   */
  export type kit_attribute_cenov_dev_ewan$attribut_kit_attribute_fk_attribute_unitToattributArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the attribut_cenov_dev_ewan
     */
    select?: attribut_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the attribut_cenov_dev_ewan
     */
    omit?: attribut_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: attribut_cenov_dev_ewanInclude<ExtArgs> | null
    where?: attribut_cenov_dev_ewanWhereInput
  }

  /**
   * kit_attribute_cenov_dev_ewan.kit
   */
  export type kit_attribute_cenov_dev_ewan$kitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
    where?: kit_cenov_dev_ewanWhereInput
  }

  /**
   * kit_attribute_cenov_dev_ewan without action
   */
  export type kit_attribute_cenov_dev_ewanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_attribute_cenov_dev_ewan
     */
    select?: kit_attribute_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_attribute_cenov_dev_ewan
     */
    omit?: kit_attribute_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_attribute_cenov_dev_ewanInclude<ExtArgs> | null
  }


  /**
   * Model part_nc_cenov_dev_ewan
   */

  export type AggregatePart_nc_cenov_dev_ewan = {
    _count: Part_nc_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Part_nc_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Part_nc_cenov_dev_ewanSumAggregateOutputType | null
    _min: Part_nc_cenov_dev_ewanMinAggregateOutputType | null
    _max: Part_nc_cenov_dev_ewanMaxAggregateOutputType | null
  }

  export type Part_nc_cenov_dev_ewanAvgAggregateOutputType = {
    par_id: number | null
    fk_kit: number | null
  }

  export type Part_nc_cenov_dev_ewanSumAggregateOutputType = {
    par_id: number | null
    fk_kit: number | null
  }

  export type Part_nc_cenov_dev_ewanMinAggregateOutputType = {
    par_id: number | null
    fk_kit: number | null
    par_label: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Part_nc_cenov_dev_ewanMaxAggregateOutputType = {
    par_id: number | null
    fk_kit: number | null
    par_label: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Part_nc_cenov_dev_ewanCountAggregateOutputType = {
    par_id: number
    fk_kit: number
    par_label: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Part_nc_cenov_dev_ewanAvgAggregateInputType = {
    par_id?: true
    fk_kit?: true
  }

  export type Part_nc_cenov_dev_ewanSumAggregateInputType = {
    par_id?: true
    fk_kit?: true
  }

  export type Part_nc_cenov_dev_ewanMinAggregateInputType = {
    par_id?: true
    fk_kit?: true
    par_label?: true
    created_at?: true
    updated_at?: true
  }

  export type Part_nc_cenov_dev_ewanMaxAggregateInputType = {
    par_id?: true
    fk_kit?: true
    par_label?: true
    created_at?: true
    updated_at?: true
  }

  export type Part_nc_cenov_dev_ewanCountAggregateInputType = {
    par_id?: true
    fk_kit?: true
    par_label?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Part_nc_cenov_dev_ewanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which part_nc_cenov_dev_ewan to aggregate.
     */
    where?: part_nc_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of part_nc_cenov_dev_ewans to fetch.
     */
    orderBy?: part_nc_cenov_dev_ewanOrderByWithRelationInput | part_nc_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: part_nc_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` part_nc_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` part_nc_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned part_nc_cenov_dev_ewans
    **/
    _count?: true | Part_nc_cenov_dev_ewanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Part_nc_cenov_dev_ewanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Part_nc_cenov_dev_ewanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Part_nc_cenov_dev_ewanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Part_nc_cenov_dev_ewanMaxAggregateInputType
  }

  export type GetPart_nc_cenov_dev_ewanAggregateType<T extends Part_nc_cenov_dev_ewanAggregateArgs> = {
        [P in keyof T & keyof AggregatePart_nc_cenov_dev_ewan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePart_nc_cenov_dev_ewan[P]>
      : GetScalarType<T[P], AggregatePart_nc_cenov_dev_ewan[P]>
  }




  export type part_nc_cenov_dev_ewanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: part_nc_cenov_dev_ewanWhereInput
    orderBy?: part_nc_cenov_dev_ewanOrderByWithAggregationInput | part_nc_cenov_dev_ewanOrderByWithAggregationInput[]
    by: Part_nc_cenov_dev_ewanScalarFieldEnum[] | Part_nc_cenov_dev_ewanScalarFieldEnum
    having?: part_nc_cenov_dev_ewanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Part_nc_cenov_dev_ewanCountAggregateInputType | true
    _avg?: Part_nc_cenov_dev_ewanAvgAggregateInputType
    _sum?: Part_nc_cenov_dev_ewanSumAggregateInputType
    _min?: Part_nc_cenov_dev_ewanMinAggregateInputType
    _max?: Part_nc_cenov_dev_ewanMaxAggregateInputType
  }

  export type Part_nc_cenov_dev_ewanGroupByOutputType = {
    par_id: number
    fk_kit: number | null
    par_label: string | null
    created_at: Date | null
    updated_at: Date | null
    _count: Part_nc_cenov_dev_ewanCountAggregateOutputType | null
    _avg: Part_nc_cenov_dev_ewanAvgAggregateOutputType | null
    _sum: Part_nc_cenov_dev_ewanSumAggregateOutputType | null
    _min: Part_nc_cenov_dev_ewanMinAggregateOutputType | null
    _max: Part_nc_cenov_dev_ewanMaxAggregateOutputType | null
  }

  type GetPart_nc_cenov_dev_ewanGroupByPayload<T extends part_nc_cenov_dev_ewanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Part_nc_cenov_dev_ewanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Part_nc_cenov_dev_ewanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Part_nc_cenov_dev_ewanGroupByOutputType[P]>
            : GetScalarType<T[P], Part_nc_cenov_dev_ewanGroupByOutputType[P]>
        }
      >
    >


  export type part_nc_cenov_dev_ewanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    par_id?: boolean
    fk_kit?: boolean
    par_label?: boolean
    created_at?: boolean
    updated_at?: boolean
    kit?: boolean | part_nc_cenov_dev_ewan$kitArgs<ExtArgs>
  }, ExtArgs["result"]["part_nc_cenov_dev_ewan"]>

  export type part_nc_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    par_id?: boolean
    fk_kit?: boolean
    par_label?: boolean
    created_at?: boolean
    updated_at?: boolean
    kit?: boolean | part_nc_cenov_dev_ewan$kitArgs<ExtArgs>
  }, ExtArgs["result"]["part_nc_cenov_dev_ewan"]>

  export type part_nc_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    par_id?: boolean
    fk_kit?: boolean
    par_label?: boolean
    created_at?: boolean
    updated_at?: boolean
    kit?: boolean | part_nc_cenov_dev_ewan$kitArgs<ExtArgs>
  }, ExtArgs["result"]["part_nc_cenov_dev_ewan"]>

  export type part_nc_cenov_dev_ewanSelectScalar = {
    par_id?: boolean
    fk_kit?: boolean
    par_label?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type part_nc_cenov_dev_ewanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"par_id" | "fk_kit" | "par_label" | "created_at" | "updated_at", ExtArgs["result"]["part_nc_cenov_dev_ewan"]>
  export type part_nc_cenov_dev_ewanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kit?: boolean | part_nc_cenov_dev_ewan$kitArgs<ExtArgs>
  }
  export type part_nc_cenov_dev_ewanIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kit?: boolean | part_nc_cenov_dev_ewan$kitArgs<ExtArgs>
  }
  export type part_nc_cenov_dev_ewanIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kit?: boolean | part_nc_cenov_dev_ewan$kitArgs<ExtArgs>
  }

  export type $part_nc_cenov_dev_ewanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "part_nc_cenov_dev_ewan"
    objects: {
      kit: Prisma.$kit_cenov_dev_ewanPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      par_id: number
      fk_kit: number | null
      par_label: string | null
      created_at: Date | null
      updated_at: Date | null
    }, ExtArgs["result"]["part_nc_cenov_dev_ewan"]>
    composites: {}
  }

  type part_nc_cenov_dev_ewanGetPayload<S extends boolean | null | undefined | part_nc_cenov_dev_ewanDefaultArgs> = $Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload, S>

  type part_nc_cenov_dev_ewanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<part_nc_cenov_dev_ewanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Part_nc_cenov_dev_ewanCountAggregateInputType | true
    }

  export interface part_nc_cenov_dev_ewanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['part_nc_cenov_dev_ewan'], meta: { name: 'part_nc_cenov_dev_ewan' } }
    /**
     * Find zero or one Part_nc_cenov_dev_ewan that matches the filter.
     * @param {part_nc_cenov_dev_ewanFindUniqueArgs} args - Arguments to find a Part_nc_cenov_dev_ewan
     * @example
     * // Get one Part_nc_cenov_dev_ewan
     * const part_nc_cenov_dev_ewan = await prisma.part_nc_cenov_dev_ewan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends part_nc_cenov_dev_ewanFindUniqueArgs>(args: SelectSubset<T, part_nc_cenov_dev_ewanFindUniqueArgs<ExtArgs>>): Prisma__part_nc_cenov_dev_ewanClient<$Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Part_nc_cenov_dev_ewan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {part_nc_cenov_dev_ewanFindUniqueOrThrowArgs} args - Arguments to find a Part_nc_cenov_dev_ewan
     * @example
     * // Get one Part_nc_cenov_dev_ewan
     * const part_nc_cenov_dev_ewan = await prisma.part_nc_cenov_dev_ewan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends part_nc_cenov_dev_ewanFindUniqueOrThrowArgs>(args: SelectSubset<T, part_nc_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__part_nc_cenov_dev_ewanClient<$Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Part_nc_cenov_dev_ewan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {part_nc_cenov_dev_ewanFindFirstArgs} args - Arguments to find a Part_nc_cenov_dev_ewan
     * @example
     * // Get one Part_nc_cenov_dev_ewan
     * const part_nc_cenov_dev_ewan = await prisma.part_nc_cenov_dev_ewan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends part_nc_cenov_dev_ewanFindFirstArgs>(args?: SelectSubset<T, part_nc_cenov_dev_ewanFindFirstArgs<ExtArgs>>): Prisma__part_nc_cenov_dev_ewanClient<$Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Part_nc_cenov_dev_ewan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {part_nc_cenov_dev_ewanFindFirstOrThrowArgs} args - Arguments to find a Part_nc_cenov_dev_ewan
     * @example
     * // Get one Part_nc_cenov_dev_ewan
     * const part_nc_cenov_dev_ewan = await prisma.part_nc_cenov_dev_ewan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends part_nc_cenov_dev_ewanFindFirstOrThrowArgs>(args?: SelectSubset<T, part_nc_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs>>): Prisma__part_nc_cenov_dev_ewanClient<$Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Part_nc_cenov_dev_ewans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {part_nc_cenov_dev_ewanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Part_nc_cenov_dev_ewans
     * const part_nc_cenov_dev_ewans = await prisma.part_nc_cenov_dev_ewan.findMany()
     * 
     * // Get first 10 Part_nc_cenov_dev_ewans
     * const part_nc_cenov_dev_ewans = await prisma.part_nc_cenov_dev_ewan.findMany({ take: 10 })
     * 
     * // Only select the `par_id`
     * const part_nc_cenov_dev_ewanWithPar_idOnly = await prisma.part_nc_cenov_dev_ewan.findMany({ select: { par_id: true } })
     * 
     */
    findMany<T extends part_nc_cenov_dev_ewanFindManyArgs>(args?: SelectSubset<T, part_nc_cenov_dev_ewanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Part_nc_cenov_dev_ewan.
     * @param {part_nc_cenov_dev_ewanCreateArgs} args - Arguments to create a Part_nc_cenov_dev_ewan.
     * @example
     * // Create one Part_nc_cenov_dev_ewan
     * const Part_nc_cenov_dev_ewan = await prisma.part_nc_cenov_dev_ewan.create({
     *   data: {
     *     // ... data to create a Part_nc_cenov_dev_ewan
     *   }
     * })
     * 
     */
    create<T extends part_nc_cenov_dev_ewanCreateArgs>(args: SelectSubset<T, part_nc_cenov_dev_ewanCreateArgs<ExtArgs>>): Prisma__part_nc_cenov_dev_ewanClient<$Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Part_nc_cenov_dev_ewans.
     * @param {part_nc_cenov_dev_ewanCreateManyArgs} args - Arguments to create many Part_nc_cenov_dev_ewans.
     * @example
     * // Create many Part_nc_cenov_dev_ewans
     * const part_nc_cenov_dev_ewan = await prisma.part_nc_cenov_dev_ewan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends part_nc_cenov_dev_ewanCreateManyArgs>(args?: SelectSubset<T, part_nc_cenov_dev_ewanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Part_nc_cenov_dev_ewans and returns the data saved in the database.
     * @param {part_nc_cenov_dev_ewanCreateManyAndReturnArgs} args - Arguments to create many Part_nc_cenov_dev_ewans.
     * @example
     * // Create many Part_nc_cenov_dev_ewans
     * const part_nc_cenov_dev_ewan = await prisma.part_nc_cenov_dev_ewan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Part_nc_cenov_dev_ewans and only return the `par_id`
     * const part_nc_cenov_dev_ewanWithPar_idOnly = await prisma.part_nc_cenov_dev_ewan.createManyAndReturn({
     *   select: { par_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends part_nc_cenov_dev_ewanCreateManyAndReturnArgs>(args?: SelectSubset<T, part_nc_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Part_nc_cenov_dev_ewan.
     * @param {part_nc_cenov_dev_ewanDeleteArgs} args - Arguments to delete one Part_nc_cenov_dev_ewan.
     * @example
     * // Delete one Part_nc_cenov_dev_ewan
     * const Part_nc_cenov_dev_ewan = await prisma.part_nc_cenov_dev_ewan.delete({
     *   where: {
     *     // ... filter to delete one Part_nc_cenov_dev_ewan
     *   }
     * })
     * 
     */
    delete<T extends part_nc_cenov_dev_ewanDeleteArgs>(args: SelectSubset<T, part_nc_cenov_dev_ewanDeleteArgs<ExtArgs>>): Prisma__part_nc_cenov_dev_ewanClient<$Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Part_nc_cenov_dev_ewan.
     * @param {part_nc_cenov_dev_ewanUpdateArgs} args - Arguments to update one Part_nc_cenov_dev_ewan.
     * @example
     * // Update one Part_nc_cenov_dev_ewan
     * const part_nc_cenov_dev_ewan = await prisma.part_nc_cenov_dev_ewan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends part_nc_cenov_dev_ewanUpdateArgs>(args: SelectSubset<T, part_nc_cenov_dev_ewanUpdateArgs<ExtArgs>>): Prisma__part_nc_cenov_dev_ewanClient<$Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Part_nc_cenov_dev_ewans.
     * @param {part_nc_cenov_dev_ewanDeleteManyArgs} args - Arguments to filter Part_nc_cenov_dev_ewans to delete.
     * @example
     * // Delete a few Part_nc_cenov_dev_ewans
     * const { count } = await prisma.part_nc_cenov_dev_ewan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends part_nc_cenov_dev_ewanDeleteManyArgs>(args?: SelectSubset<T, part_nc_cenov_dev_ewanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Part_nc_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {part_nc_cenov_dev_ewanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Part_nc_cenov_dev_ewans
     * const part_nc_cenov_dev_ewan = await prisma.part_nc_cenov_dev_ewan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends part_nc_cenov_dev_ewanUpdateManyArgs>(args: SelectSubset<T, part_nc_cenov_dev_ewanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Part_nc_cenov_dev_ewans and returns the data updated in the database.
     * @param {part_nc_cenov_dev_ewanUpdateManyAndReturnArgs} args - Arguments to update many Part_nc_cenov_dev_ewans.
     * @example
     * // Update many Part_nc_cenov_dev_ewans
     * const part_nc_cenov_dev_ewan = await prisma.part_nc_cenov_dev_ewan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Part_nc_cenov_dev_ewans and only return the `par_id`
     * const part_nc_cenov_dev_ewanWithPar_idOnly = await prisma.part_nc_cenov_dev_ewan.updateManyAndReturn({
     *   select: { par_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends part_nc_cenov_dev_ewanUpdateManyAndReturnArgs>(args: SelectSubset<T, part_nc_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Part_nc_cenov_dev_ewan.
     * @param {part_nc_cenov_dev_ewanUpsertArgs} args - Arguments to update or create a Part_nc_cenov_dev_ewan.
     * @example
     * // Update or create a Part_nc_cenov_dev_ewan
     * const part_nc_cenov_dev_ewan = await prisma.part_nc_cenov_dev_ewan.upsert({
     *   create: {
     *     // ... data to create a Part_nc_cenov_dev_ewan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Part_nc_cenov_dev_ewan we want to update
     *   }
     * })
     */
    upsert<T extends part_nc_cenov_dev_ewanUpsertArgs>(args: SelectSubset<T, part_nc_cenov_dev_ewanUpsertArgs<ExtArgs>>): Prisma__part_nc_cenov_dev_ewanClient<$Result.GetResult<Prisma.$part_nc_cenov_dev_ewanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Part_nc_cenov_dev_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {part_nc_cenov_dev_ewanCountArgs} args - Arguments to filter Part_nc_cenov_dev_ewans to count.
     * @example
     * // Count the number of Part_nc_cenov_dev_ewans
     * const count = await prisma.part_nc_cenov_dev_ewan.count({
     *   where: {
     *     // ... the filter for the Part_nc_cenov_dev_ewans we want to count
     *   }
     * })
    **/
    count<T extends part_nc_cenov_dev_ewanCountArgs>(
      args?: Subset<T, part_nc_cenov_dev_ewanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Part_nc_cenov_dev_ewanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Part_nc_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Part_nc_cenov_dev_ewanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Part_nc_cenov_dev_ewanAggregateArgs>(args: Subset<T, Part_nc_cenov_dev_ewanAggregateArgs>): Prisma.PrismaPromise<GetPart_nc_cenov_dev_ewanAggregateType<T>>

    /**
     * Group by Part_nc_cenov_dev_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {part_nc_cenov_dev_ewanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends part_nc_cenov_dev_ewanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: part_nc_cenov_dev_ewanGroupByArgs['orderBy'] }
        : { orderBy?: part_nc_cenov_dev_ewanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, part_nc_cenov_dev_ewanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPart_nc_cenov_dev_ewanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the part_nc_cenov_dev_ewan model
   */
  readonly fields: part_nc_cenov_dev_ewanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for part_nc_cenov_dev_ewan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__part_nc_cenov_dev_ewanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    kit<T extends part_nc_cenov_dev_ewan$kitArgs<ExtArgs> = {}>(args?: Subset<T, part_nc_cenov_dev_ewan$kitArgs<ExtArgs>>): Prisma__kit_cenov_dev_ewanClient<$Result.GetResult<Prisma.$kit_cenov_dev_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the part_nc_cenov_dev_ewan model
   */
  interface part_nc_cenov_dev_ewanFieldRefs {
    readonly par_id: FieldRef<"part_nc_cenov_dev_ewan", 'Int'>
    readonly fk_kit: FieldRef<"part_nc_cenov_dev_ewan", 'Int'>
    readonly par_label: FieldRef<"part_nc_cenov_dev_ewan", 'String'>
    readonly created_at: FieldRef<"part_nc_cenov_dev_ewan", 'DateTime'>
    readonly updated_at: FieldRef<"part_nc_cenov_dev_ewan", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * part_nc_cenov_dev_ewan findUnique
   */
  export type part_nc_cenov_dev_ewanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which part_nc_cenov_dev_ewan to fetch.
     */
    where: part_nc_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * part_nc_cenov_dev_ewan findUniqueOrThrow
   */
  export type part_nc_cenov_dev_ewanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which part_nc_cenov_dev_ewan to fetch.
     */
    where: part_nc_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * part_nc_cenov_dev_ewan findFirst
   */
  export type part_nc_cenov_dev_ewanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which part_nc_cenov_dev_ewan to fetch.
     */
    where?: part_nc_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of part_nc_cenov_dev_ewans to fetch.
     */
    orderBy?: part_nc_cenov_dev_ewanOrderByWithRelationInput | part_nc_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for part_nc_cenov_dev_ewans.
     */
    cursor?: part_nc_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` part_nc_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` part_nc_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of part_nc_cenov_dev_ewans.
     */
    distinct?: Part_nc_cenov_dev_ewanScalarFieldEnum | Part_nc_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * part_nc_cenov_dev_ewan findFirstOrThrow
   */
  export type part_nc_cenov_dev_ewanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which part_nc_cenov_dev_ewan to fetch.
     */
    where?: part_nc_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of part_nc_cenov_dev_ewans to fetch.
     */
    orderBy?: part_nc_cenov_dev_ewanOrderByWithRelationInput | part_nc_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for part_nc_cenov_dev_ewans.
     */
    cursor?: part_nc_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` part_nc_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` part_nc_cenov_dev_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of part_nc_cenov_dev_ewans.
     */
    distinct?: Part_nc_cenov_dev_ewanScalarFieldEnum | Part_nc_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * part_nc_cenov_dev_ewan findMany
   */
  export type part_nc_cenov_dev_ewanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter, which part_nc_cenov_dev_ewans to fetch.
     */
    where?: part_nc_cenov_dev_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of part_nc_cenov_dev_ewans to fetch.
     */
    orderBy?: part_nc_cenov_dev_ewanOrderByWithRelationInput | part_nc_cenov_dev_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing part_nc_cenov_dev_ewans.
     */
    cursor?: part_nc_cenov_dev_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` part_nc_cenov_dev_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` part_nc_cenov_dev_ewans.
     */
    skip?: number
    distinct?: Part_nc_cenov_dev_ewanScalarFieldEnum | Part_nc_cenov_dev_ewanScalarFieldEnum[]
  }

  /**
   * part_nc_cenov_dev_ewan create
   */
  export type part_nc_cenov_dev_ewanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to create a part_nc_cenov_dev_ewan.
     */
    data?: XOR<part_nc_cenov_dev_ewanCreateInput, part_nc_cenov_dev_ewanUncheckedCreateInput>
  }

  /**
   * part_nc_cenov_dev_ewan createMany
   */
  export type part_nc_cenov_dev_ewanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many part_nc_cenov_dev_ewans.
     */
    data: part_nc_cenov_dev_ewanCreateManyInput | part_nc_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * part_nc_cenov_dev_ewan createManyAndReturn
   */
  export type part_nc_cenov_dev_ewanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to create many part_nc_cenov_dev_ewans.
     */
    data: part_nc_cenov_dev_ewanCreateManyInput | part_nc_cenov_dev_ewanCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * part_nc_cenov_dev_ewan update
   */
  export type part_nc_cenov_dev_ewanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The data needed to update a part_nc_cenov_dev_ewan.
     */
    data: XOR<part_nc_cenov_dev_ewanUpdateInput, part_nc_cenov_dev_ewanUncheckedUpdateInput>
    /**
     * Choose, which part_nc_cenov_dev_ewan to update.
     */
    where: part_nc_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * part_nc_cenov_dev_ewan updateMany
   */
  export type part_nc_cenov_dev_ewanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update part_nc_cenov_dev_ewans.
     */
    data: XOR<part_nc_cenov_dev_ewanUpdateManyMutationInput, part_nc_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which part_nc_cenov_dev_ewans to update
     */
    where?: part_nc_cenov_dev_ewanWhereInput
    /**
     * Limit how many part_nc_cenov_dev_ewans to update.
     */
    limit?: number
  }

  /**
   * part_nc_cenov_dev_ewan updateManyAndReturn
   */
  export type part_nc_cenov_dev_ewanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * The data used to update part_nc_cenov_dev_ewans.
     */
    data: XOR<part_nc_cenov_dev_ewanUpdateManyMutationInput, part_nc_cenov_dev_ewanUncheckedUpdateManyInput>
    /**
     * Filter which part_nc_cenov_dev_ewans to update
     */
    where?: part_nc_cenov_dev_ewanWhereInput
    /**
     * Limit how many part_nc_cenov_dev_ewans to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * part_nc_cenov_dev_ewan upsert
   */
  export type part_nc_cenov_dev_ewanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * The filter to search for the part_nc_cenov_dev_ewan to update in case it exists.
     */
    where: part_nc_cenov_dev_ewanWhereUniqueInput
    /**
     * In case the part_nc_cenov_dev_ewan found by the `where` argument doesn't exist, create a new part_nc_cenov_dev_ewan with this data.
     */
    create: XOR<part_nc_cenov_dev_ewanCreateInput, part_nc_cenov_dev_ewanUncheckedCreateInput>
    /**
     * In case the part_nc_cenov_dev_ewan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<part_nc_cenov_dev_ewanUpdateInput, part_nc_cenov_dev_ewanUncheckedUpdateInput>
  }

  /**
   * part_nc_cenov_dev_ewan delete
   */
  export type part_nc_cenov_dev_ewanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanInclude<ExtArgs> | null
    /**
     * Filter which part_nc_cenov_dev_ewan to delete.
     */
    where: part_nc_cenov_dev_ewanWhereUniqueInput
  }

  /**
   * part_nc_cenov_dev_ewan deleteMany
   */
  export type part_nc_cenov_dev_ewanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which part_nc_cenov_dev_ewans to delete
     */
    where?: part_nc_cenov_dev_ewanWhereInput
    /**
     * Limit how many part_nc_cenov_dev_ewans to delete.
     */
    limit?: number
  }

  /**
   * part_nc_cenov_dev_ewan.kit
   */
  export type part_nc_cenov_dev_ewan$kitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the kit_cenov_dev_ewan
     */
    select?: kit_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the kit_cenov_dev_ewan
     */
    omit?: kit_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: kit_cenov_dev_ewanInclude<ExtArgs> | null
    where?: kit_cenov_dev_ewanWhereInput
  }

  /**
   * part_nc_cenov_dev_ewan without action
   */
  export type part_nc_cenov_dev_ewanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the part_nc_cenov_dev_ewan
     */
    select?: part_nc_cenov_dev_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the part_nc_cenov_dev_ewan
     */
    omit?: part_nc_cenov_dev_ewanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: part_nc_cenov_dev_ewanInclude<ExtArgs> | null
  }


  /**
   * Model famille_ewan
   */

  export type AggregateFamille_ewan = {
    _count: Famille_ewanCountAggregateOutputType | null
    _avg: Famille_ewanAvgAggregateOutputType | null
    _sum: Famille_ewanSumAggregateOutputType | null
    _min: Famille_ewanMinAggregateOutputType | null
    _max: Famille_ewanMaxAggregateOutputType | null
  }

  export type Famille_ewanAvgAggregateOutputType = {
    fam_id: number | null
    fk_parent: number | null
    fk_supplier: number | null
  }

  export type Famille_ewanSumAggregateOutputType = {
    fam_id: number | null
    fk_parent: number | null
    fk_supplier: number | null
  }

  export type Famille_ewanMinAggregateOutputType = {
    fam_id: number | null
    fk_parent: number | null
    fam_code: string | null
    fam_label: string | null
    fk_supplier: number | null
  }

  export type Famille_ewanMaxAggregateOutputType = {
    fam_id: number | null
    fk_parent: number | null
    fam_code: string | null
    fam_label: string | null
    fk_supplier: number | null
  }

  export type Famille_ewanCountAggregateOutputType = {
    fam_id: number
    fk_parent: number
    fam_code: number
    fam_label: number
    fk_supplier: number
    _all: number
  }


  export type Famille_ewanAvgAggregateInputType = {
    fam_id?: true
    fk_parent?: true
    fk_supplier?: true
  }

  export type Famille_ewanSumAggregateInputType = {
    fam_id?: true
    fk_parent?: true
    fk_supplier?: true
  }

  export type Famille_ewanMinAggregateInputType = {
    fam_id?: true
    fk_parent?: true
    fam_code?: true
    fam_label?: true
    fk_supplier?: true
  }

  export type Famille_ewanMaxAggregateInputType = {
    fam_id?: true
    fk_parent?: true
    fam_code?: true
    fam_label?: true
    fk_supplier?: true
  }

  export type Famille_ewanCountAggregateInputType = {
    fam_id?: true
    fk_parent?: true
    fam_code?: true
    fam_label?: true
    fk_supplier?: true
    _all?: true
  }

  export type Famille_ewanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which famille_ewan to aggregate.
     */
    where?: famille_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of famille_ewans to fetch.
     */
    orderBy?: famille_ewanOrderByWithRelationInput | famille_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: famille_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` famille_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` famille_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned famille_ewans
    **/
    _count?: true | Famille_ewanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Famille_ewanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Famille_ewanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Famille_ewanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Famille_ewanMaxAggregateInputType
  }

  export type GetFamille_ewanAggregateType<T extends Famille_ewanAggregateArgs> = {
        [P in keyof T & keyof AggregateFamille_ewan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFamille_ewan[P]>
      : GetScalarType<T[P], AggregateFamille_ewan[P]>
  }




  export type famille_ewanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: famille_ewanWhereInput
    orderBy?: famille_ewanOrderByWithAggregationInput | famille_ewanOrderByWithAggregationInput[]
    by: Famille_ewanScalarFieldEnum[] | Famille_ewanScalarFieldEnum
    having?: famille_ewanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Famille_ewanCountAggregateInputType | true
    _avg?: Famille_ewanAvgAggregateInputType
    _sum?: Famille_ewanSumAggregateInputType
    _min?: Famille_ewanMinAggregateInputType
    _max?: Famille_ewanMaxAggregateInputType
  }

  export type Famille_ewanGroupByOutputType = {
    fam_id: number
    fk_parent: number | null
    fam_code: string | null
    fam_label: string | null
    fk_supplier: number | null
    _count: Famille_ewanCountAggregateOutputType | null
    _avg: Famille_ewanAvgAggregateOutputType | null
    _sum: Famille_ewanSumAggregateOutputType | null
    _min: Famille_ewanMinAggregateOutputType | null
    _max: Famille_ewanMaxAggregateOutputType | null
  }

  type GetFamille_ewanGroupByPayload<T extends famille_ewanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Famille_ewanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Famille_ewanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Famille_ewanGroupByOutputType[P]>
            : GetScalarType<T[P], Famille_ewanGroupByOutputType[P]>
        }
      >
    >


  export type famille_ewanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fam_id?: boolean
    fk_parent?: boolean
    fam_code?: boolean
    fam_label?: boolean
    fk_supplier?: boolean
  }, ExtArgs["result"]["famille_ewan"]>

  export type famille_ewanSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fam_id?: boolean
    fk_parent?: boolean
    fam_code?: boolean
    fam_label?: boolean
    fk_supplier?: boolean
  }, ExtArgs["result"]["famille_ewan"]>

  export type famille_ewanSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    fam_id?: boolean
    fk_parent?: boolean
    fam_code?: boolean
    fam_label?: boolean
    fk_supplier?: boolean
  }, ExtArgs["result"]["famille_ewan"]>

  export type famille_ewanSelectScalar = {
    fam_id?: boolean
    fk_parent?: boolean
    fam_code?: boolean
    fam_label?: boolean
    fk_supplier?: boolean
  }

  export type famille_ewanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"fam_id" | "fk_parent" | "fam_code" | "fam_label" | "fk_supplier", ExtArgs["result"]["famille_ewan"]>

  export type $famille_ewanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "famille_ewan"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      fam_id: number
      fk_parent: number | null
      fam_code: string | null
      fam_label: string | null
      fk_supplier: number | null
    }, ExtArgs["result"]["famille_ewan"]>
    composites: {}
  }

  type famille_ewanGetPayload<S extends boolean | null | undefined | famille_ewanDefaultArgs> = $Result.GetResult<Prisma.$famille_ewanPayload, S>

  type famille_ewanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<famille_ewanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Famille_ewanCountAggregateInputType | true
    }

  export interface famille_ewanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['famille_ewan'], meta: { name: 'famille_ewan' } }
    /**
     * Find zero or one Famille_ewan that matches the filter.
     * @param {famille_ewanFindUniqueArgs} args - Arguments to find a Famille_ewan
     * @example
     * // Get one Famille_ewan
     * const famille_ewan = await prisma.famille_ewan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends famille_ewanFindUniqueArgs>(args: SelectSubset<T, famille_ewanFindUniqueArgs<ExtArgs>>): Prisma__famille_ewanClient<$Result.GetResult<Prisma.$famille_ewanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Famille_ewan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {famille_ewanFindUniqueOrThrowArgs} args - Arguments to find a Famille_ewan
     * @example
     * // Get one Famille_ewan
     * const famille_ewan = await prisma.famille_ewan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends famille_ewanFindUniqueOrThrowArgs>(args: SelectSubset<T, famille_ewanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__famille_ewanClient<$Result.GetResult<Prisma.$famille_ewanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Famille_ewan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {famille_ewanFindFirstArgs} args - Arguments to find a Famille_ewan
     * @example
     * // Get one Famille_ewan
     * const famille_ewan = await prisma.famille_ewan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends famille_ewanFindFirstArgs>(args?: SelectSubset<T, famille_ewanFindFirstArgs<ExtArgs>>): Prisma__famille_ewanClient<$Result.GetResult<Prisma.$famille_ewanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Famille_ewan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {famille_ewanFindFirstOrThrowArgs} args - Arguments to find a Famille_ewan
     * @example
     * // Get one Famille_ewan
     * const famille_ewan = await prisma.famille_ewan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends famille_ewanFindFirstOrThrowArgs>(args?: SelectSubset<T, famille_ewanFindFirstOrThrowArgs<ExtArgs>>): Prisma__famille_ewanClient<$Result.GetResult<Prisma.$famille_ewanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Famille_ewans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {famille_ewanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Famille_ewans
     * const famille_ewans = await prisma.famille_ewan.findMany()
     * 
     * // Get first 10 Famille_ewans
     * const famille_ewans = await prisma.famille_ewan.findMany({ take: 10 })
     * 
     * // Only select the `fam_id`
     * const famille_ewanWithFam_idOnly = await prisma.famille_ewan.findMany({ select: { fam_id: true } })
     * 
     */
    findMany<T extends famille_ewanFindManyArgs>(args?: SelectSubset<T, famille_ewanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$famille_ewanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Famille_ewan.
     * @param {famille_ewanCreateArgs} args - Arguments to create a Famille_ewan.
     * @example
     * // Create one Famille_ewan
     * const Famille_ewan = await prisma.famille_ewan.create({
     *   data: {
     *     // ... data to create a Famille_ewan
     *   }
     * })
     * 
     */
    create<T extends famille_ewanCreateArgs>(args: SelectSubset<T, famille_ewanCreateArgs<ExtArgs>>): Prisma__famille_ewanClient<$Result.GetResult<Prisma.$famille_ewanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Famille_ewans.
     * @param {famille_ewanCreateManyArgs} args - Arguments to create many Famille_ewans.
     * @example
     * // Create many Famille_ewans
     * const famille_ewan = await prisma.famille_ewan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends famille_ewanCreateManyArgs>(args?: SelectSubset<T, famille_ewanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Famille_ewans and returns the data saved in the database.
     * @param {famille_ewanCreateManyAndReturnArgs} args - Arguments to create many Famille_ewans.
     * @example
     * // Create many Famille_ewans
     * const famille_ewan = await prisma.famille_ewan.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Famille_ewans and only return the `fam_id`
     * const famille_ewanWithFam_idOnly = await prisma.famille_ewan.createManyAndReturn({
     *   select: { fam_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends famille_ewanCreateManyAndReturnArgs>(args?: SelectSubset<T, famille_ewanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$famille_ewanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Famille_ewan.
     * @param {famille_ewanDeleteArgs} args - Arguments to delete one Famille_ewan.
     * @example
     * // Delete one Famille_ewan
     * const Famille_ewan = await prisma.famille_ewan.delete({
     *   where: {
     *     // ... filter to delete one Famille_ewan
     *   }
     * })
     * 
     */
    delete<T extends famille_ewanDeleteArgs>(args: SelectSubset<T, famille_ewanDeleteArgs<ExtArgs>>): Prisma__famille_ewanClient<$Result.GetResult<Prisma.$famille_ewanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Famille_ewan.
     * @param {famille_ewanUpdateArgs} args - Arguments to update one Famille_ewan.
     * @example
     * // Update one Famille_ewan
     * const famille_ewan = await prisma.famille_ewan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends famille_ewanUpdateArgs>(args: SelectSubset<T, famille_ewanUpdateArgs<ExtArgs>>): Prisma__famille_ewanClient<$Result.GetResult<Prisma.$famille_ewanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Famille_ewans.
     * @param {famille_ewanDeleteManyArgs} args - Arguments to filter Famille_ewans to delete.
     * @example
     * // Delete a few Famille_ewans
     * const { count } = await prisma.famille_ewan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends famille_ewanDeleteManyArgs>(args?: SelectSubset<T, famille_ewanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Famille_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {famille_ewanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Famille_ewans
     * const famille_ewan = await prisma.famille_ewan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends famille_ewanUpdateManyArgs>(args: SelectSubset<T, famille_ewanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Famille_ewans and returns the data updated in the database.
     * @param {famille_ewanUpdateManyAndReturnArgs} args - Arguments to update many Famille_ewans.
     * @example
     * // Update many Famille_ewans
     * const famille_ewan = await prisma.famille_ewan.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Famille_ewans and only return the `fam_id`
     * const famille_ewanWithFam_idOnly = await prisma.famille_ewan.updateManyAndReturn({
     *   select: { fam_id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends famille_ewanUpdateManyAndReturnArgs>(args: SelectSubset<T, famille_ewanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$famille_ewanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Famille_ewan.
     * @param {famille_ewanUpsertArgs} args - Arguments to update or create a Famille_ewan.
     * @example
     * // Update or create a Famille_ewan
     * const famille_ewan = await prisma.famille_ewan.upsert({
     *   create: {
     *     // ... data to create a Famille_ewan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Famille_ewan we want to update
     *   }
     * })
     */
    upsert<T extends famille_ewanUpsertArgs>(args: SelectSubset<T, famille_ewanUpsertArgs<ExtArgs>>): Prisma__famille_ewanClient<$Result.GetResult<Prisma.$famille_ewanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Famille_ewans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {famille_ewanCountArgs} args - Arguments to filter Famille_ewans to count.
     * @example
     * // Count the number of Famille_ewans
     * const count = await prisma.famille_ewan.count({
     *   where: {
     *     // ... the filter for the Famille_ewans we want to count
     *   }
     * })
    **/
    count<T extends famille_ewanCountArgs>(
      args?: Subset<T, famille_ewanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Famille_ewanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Famille_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Famille_ewanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Famille_ewanAggregateArgs>(args: Subset<T, Famille_ewanAggregateArgs>): Prisma.PrismaPromise<GetFamille_ewanAggregateType<T>>

    /**
     * Group by Famille_ewan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {famille_ewanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends famille_ewanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: famille_ewanGroupByArgs['orderBy'] }
        : { orderBy?: famille_ewanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, famille_ewanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFamille_ewanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the famille_ewan model
   */
  readonly fields: famille_ewanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for famille_ewan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__famille_ewanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the famille_ewan model
   */
  interface famille_ewanFieldRefs {
    readonly fam_id: FieldRef<"famille_ewan", 'Int'>
    readonly fk_parent: FieldRef<"famille_ewan", 'Int'>
    readonly fam_code: FieldRef<"famille_ewan", 'String'>
    readonly fam_label: FieldRef<"famille_ewan", 'String'>
    readonly fk_supplier: FieldRef<"famille_ewan", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * famille_ewan findUnique
   */
  export type famille_ewanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille_ewan
     */
    select?: famille_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille_ewan
     */
    omit?: famille_ewanOmit<ExtArgs> | null
    /**
     * Filter, which famille_ewan to fetch.
     */
    where: famille_ewanWhereUniqueInput
  }

  /**
   * famille_ewan findUniqueOrThrow
   */
  export type famille_ewanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille_ewan
     */
    select?: famille_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille_ewan
     */
    omit?: famille_ewanOmit<ExtArgs> | null
    /**
     * Filter, which famille_ewan to fetch.
     */
    where: famille_ewanWhereUniqueInput
  }

  /**
   * famille_ewan findFirst
   */
  export type famille_ewanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille_ewan
     */
    select?: famille_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille_ewan
     */
    omit?: famille_ewanOmit<ExtArgs> | null
    /**
     * Filter, which famille_ewan to fetch.
     */
    where?: famille_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of famille_ewans to fetch.
     */
    orderBy?: famille_ewanOrderByWithRelationInput | famille_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for famille_ewans.
     */
    cursor?: famille_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` famille_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` famille_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of famille_ewans.
     */
    distinct?: Famille_ewanScalarFieldEnum | Famille_ewanScalarFieldEnum[]
  }

  /**
   * famille_ewan findFirstOrThrow
   */
  export type famille_ewanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille_ewan
     */
    select?: famille_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille_ewan
     */
    omit?: famille_ewanOmit<ExtArgs> | null
    /**
     * Filter, which famille_ewan to fetch.
     */
    where?: famille_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of famille_ewans to fetch.
     */
    orderBy?: famille_ewanOrderByWithRelationInput | famille_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for famille_ewans.
     */
    cursor?: famille_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` famille_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` famille_ewans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of famille_ewans.
     */
    distinct?: Famille_ewanScalarFieldEnum | Famille_ewanScalarFieldEnum[]
  }

  /**
   * famille_ewan findMany
   */
  export type famille_ewanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille_ewan
     */
    select?: famille_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille_ewan
     */
    omit?: famille_ewanOmit<ExtArgs> | null
    /**
     * Filter, which famille_ewans to fetch.
     */
    where?: famille_ewanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of famille_ewans to fetch.
     */
    orderBy?: famille_ewanOrderByWithRelationInput | famille_ewanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing famille_ewans.
     */
    cursor?: famille_ewanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` famille_ewans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` famille_ewans.
     */
    skip?: number
    distinct?: Famille_ewanScalarFieldEnum | Famille_ewanScalarFieldEnum[]
  }

  /**
   * famille_ewan create
   */
  export type famille_ewanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille_ewan
     */
    select?: famille_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille_ewan
     */
    omit?: famille_ewanOmit<ExtArgs> | null
    /**
     * The data needed to create a famille_ewan.
     */
    data: XOR<famille_ewanCreateInput, famille_ewanUncheckedCreateInput>
  }

  /**
   * famille_ewan createMany
   */
  export type famille_ewanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many famille_ewans.
     */
    data: famille_ewanCreateManyInput | famille_ewanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * famille_ewan createManyAndReturn
   */
  export type famille_ewanCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille_ewan
     */
    select?: famille_ewanSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the famille_ewan
     */
    omit?: famille_ewanOmit<ExtArgs> | null
    /**
     * The data used to create many famille_ewans.
     */
    data: famille_ewanCreateManyInput | famille_ewanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * famille_ewan update
   */
  export type famille_ewanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille_ewan
     */
    select?: famille_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille_ewan
     */
    omit?: famille_ewanOmit<ExtArgs> | null
    /**
     * The data needed to update a famille_ewan.
     */
    data: XOR<famille_ewanUpdateInput, famille_ewanUncheckedUpdateInput>
    /**
     * Choose, which famille_ewan to update.
     */
    where: famille_ewanWhereUniqueInput
  }

  /**
   * famille_ewan updateMany
   */
  export type famille_ewanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update famille_ewans.
     */
    data: XOR<famille_ewanUpdateManyMutationInput, famille_ewanUncheckedUpdateManyInput>
    /**
     * Filter which famille_ewans to update
     */
    where?: famille_ewanWhereInput
    /**
     * Limit how many famille_ewans to update.
     */
    limit?: number
  }

  /**
   * famille_ewan updateManyAndReturn
   */
  export type famille_ewanUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille_ewan
     */
    select?: famille_ewanSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the famille_ewan
     */
    omit?: famille_ewanOmit<ExtArgs> | null
    /**
     * The data used to update famille_ewans.
     */
    data: XOR<famille_ewanUpdateManyMutationInput, famille_ewanUncheckedUpdateManyInput>
    /**
     * Filter which famille_ewans to update
     */
    where?: famille_ewanWhereInput
    /**
     * Limit how many famille_ewans to update.
     */
    limit?: number
  }

  /**
   * famille_ewan upsert
   */
  export type famille_ewanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille_ewan
     */
    select?: famille_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille_ewan
     */
    omit?: famille_ewanOmit<ExtArgs> | null
    /**
     * The filter to search for the famille_ewan to update in case it exists.
     */
    where: famille_ewanWhereUniqueInput
    /**
     * In case the famille_ewan found by the `where` argument doesn't exist, create a new famille_ewan with this data.
     */
    create: XOR<famille_ewanCreateInput, famille_ewanUncheckedCreateInput>
    /**
     * In case the famille_ewan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<famille_ewanUpdateInput, famille_ewanUncheckedUpdateInput>
  }

  /**
   * famille_ewan delete
   */
  export type famille_ewanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille_ewan
     */
    select?: famille_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille_ewan
     */
    omit?: famille_ewanOmit<ExtArgs> | null
    /**
     * Filter which famille_ewan to delete.
     */
    where: famille_ewanWhereUniqueInput
  }

  /**
   * famille_ewan deleteMany
   */
  export type famille_ewanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which famille_ewans to delete
     */
    where?: famille_ewanWhereInput
    /**
     * Limit how many famille_ewans to delete.
     */
    limit?: number
  }

  /**
   * famille_ewan without action
   */
  export type famille_ewanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the famille_ewan
     */
    select?: famille_ewanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the famille_ewan
     */
    omit?: famille_ewanOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CategorieScalarFieldEnum: {
    cat_id: 'cat_id',
    fk_parent: 'fk_parent',
    cat_code: 'cat_code',
    cat_label: 'cat_label'
  };

  export type CategorieScalarFieldEnum = (typeof CategorieScalarFieldEnum)[keyof typeof CategorieScalarFieldEnum]


  export const Categorie_attribut_cenov_dev_ewanScalarFieldEnum: {
    fk_categorie: 'fk_categorie',
    fk_attribute: 'fk_attribute'
  };

  export type Categorie_attribut_cenov_dev_ewanScalarFieldEnum = (typeof Categorie_attribut_cenov_dev_ewanScalarFieldEnum)[keyof typeof Categorie_attribut_cenov_dev_ewanScalarFieldEnum]


  export const Cross_refScalarFieldEnum: {
    crf_id: 'crf_id',
    fk_produit: 'fk_produit'
  };

  export type Cross_refScalarFieldEnum = (typeof Cross_refScalarFieldEnum)[keyof typeof Cross_refScalarFieldEnum]


  export const FamilleScalarFieldEnum: {
    fam_id: 'fam_id',
    fk_parent: 'fk_parent',
    fam_code: 'fam_code',
    fam_label: 'fam_label',
    fk_supplier: 'fk_supplier'
  };

  export type FamilleScalarFieldEnum = (typeof FamilleScalarFieldEnum)[keyof typeof FamilleScalarFieldEnum]


  export const ProduitScalarFieldEnum: {
    pro_id: 'pro_id',
    pro_code: 'pro_code',
    fk_supplier: 'fk_supplier',
    fk_kit: 'fk_kit',
    fk_famille: 'fk_famille',
    fk_sfamille: 'fk_sfamille',
    fk_ssfamille: 'fk_ssfamille',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ProduitScalarFieldEnum = (typeof ProduitScalarFieldEnum)[keyof typeof ProduitScalarFieldEnum]


  export const Produit_categorie_cenov_dev_ewanScalarFieldEnum: {
    fk_produit: 'fk_produit',
    fk_categorie: 'fk_categorie'
  };

  export type Produit_categorie_cenov_dev_ewanScalarFieldEnum = (typeof Produit_categorie_cenov_dev_ewanScalarFieldEnum)[keyof typeof Produit_categorie_cenov_dev_ewanScalarFieldEnum]


  export const Tarif_achat_cenov_dev_ewanScalarFieldEnum: {
    fk_produit: 'fk_produit',
    taa_date: 'taa_date',
    taa_montant: 'taa_montant',
    taa_remise: 'taa_remise',
    taa_montant_net: 'taa_montant_net'
  };

  export type Tarif_achat_cenov_dev_ewanScalarFieldEnum = (typeof Tarif_achat_cenov_dev_ewanScalarFieldEnum)[keyof typeof Tarif_achat_cenov_dev_ewanScalarFieldEnum]


  export const Attribut_cenov_dev_ewanScalarFieldEnum: {
    atr_id: 'atr_id',
    atr_nat: 'atr_nat',
    atr_val: 'atr_val',
    atr_label: 'atr_label',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Attribut_cenov_dev_ewanScalarFieldEnum = (typeof Attribut_cenov_dev_ewanScalarFieldEnum)[keyof typeof Attribut_cenov_dev_ewanScalarFieldEnum]


  export const FournisseurScalarFieldEnum: {
    frs_id: 'frs_id',
    frs_code: 'frs_code',
    frs_label: 'frs_label'
  };

  export type FournisseurScalarFieldEnum = (typeof FournisseurScalarFieldEnum)[keyof typeof FournisseurScalarFieldEnum]


  export const Kit_cenov_dev_ewanScalarFieldEnum: {
    kit_id: 'kit_id',
    kit_label: 'kit_label',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Kit_cenov_dev_ewanScalarFieldEnum = (typeof Kit_cenov_dev_ewanScalarFieldEnum)[keyof typeof Kit_cenov_dev_ewanScalarFieldEnum]


  export const Kit_attribute_cenov_dev_ewanScalarFieldEnum: {
    fk_kit: 'fk_kit',
    fk_attribute_carac: 'fk_attribute_carac',
    fk_attribute_unit: 'fk_attribute_unit',
    kat_valeur: 'kat_valeur',
    created_at: 'created_at',
    updated_at: 'updated_at',
    kat_id: 'kat_id'
  };

  export type Kit_attribute_cenov_dev_ewanScalarFieldEnum = (typeof Kit_attribute_cenov_dev_ewanScalarFieldEnum)[keyof typeof Kit_attribute_cenov_dev_ewanScalarFieldEnum]


  export const Part_nc_cenov_dev_ewanScalarFieldEnum: {
    par_id: 'par_id',
    fk_kit: 'fk_kit',
    par_label: 'par_label',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Part_nc_cenov_dev_ewanScalarFieldEnum = (typeof Part_nc_cenov_dev_ewanScalarFieldEnum)[keyof typeof Part_nc_cenov_dev_ewanScalarFieldEnum]


  export const Famille_ewanScalarFieldEnum: {
    fam_id: 'fam_id',
    fk_parent: 'fk_parent',
    fam_code: 'fam_code',
    fam_label: 'fam_label',
    fk_supplier: 'fk_supplier'
  };

  export type Famille_ewanScalarFieldEnum = (typeof Famille_ewanScalarFieldEnum)[keyof typeof Famille_ewanScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type categorieWhereInput = {
    AND?: categorieWhereInput | categorieWhereInput[]
    OR?: categorieWhereInput[]
    NOT?: categorieWhereInput | categorieWhereInput[]
    cat_id?: IntFilter<"categorie"> | number
    fk_parent?: IntNullableFilter<"categorie"> | number | null
    cat_code?: StringNullableFilter<"categorie"> | string | null
    cat_label?: StringNullableFilter<"categorie"> | string | null
    categorie?: XOR<CategorieNullableScalarRelationFilter, categorieWhereInput> | null
    other_categorie?: CategorieListRelationFilter
    categorie_attribut?: Categorie_attribut_cenov_dev_ewanListRelationFilter
    produit_categorie?: Produit_categorie_cenov_dev_ewanListRelationFilter
  }

  export type categorieOrderByWithRelationInput = {
    cat_id?: SortOrder
    fk_parent?: SortOrderInput | SortOrder
    cat_code?: SortOrderInput | SortOrder
    cat_label?: SortOrderInput | SortOrder
    categorie?: categorieOrderByWithRelationInput
    other_categorie?: categorieOrderByRelationAggregateInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanOrderByRelationAggregateInput
    produit_categorie?: produit_categorie_cenov_dev_ewanOrderByRelationAggregateInput
  }

  export type categorieWhereUniqueInput = Prisma.AtLeast<{
    cat_id?: number
    fk_parent_cat_code?: categorieFk_parentCat_codeCompoundUniqueInput
    AND?: categorieWhereInput | categorieWhereInput[]
    OR?: categorieWhereInput[]
    NOT?: categorieWhereInput | categorieWhereInput[]
    fk_parent?: IntNullableFilter<"categorie"> | number | null
    cat_code?: StringNullableFilter<"categorie"> | string | null
    cat_label?: StringNullableFilter<"categorie"> | string | null
    categorie?: XOR<CategorieNullableScalarRelationFilter, categorieWhereInput> | null
    other_categorie?: CategorieListRelationFilter
    categorie_attribut?: Categorie_attribut_cenov_dev_ewanListRelationFilter
    produit_categorie?: Produit_categorie_cenov_dev_ewanListRelationFilter
  }, "cat_id" | "fk_parent_cat_code">

  export type categorieOrderByWithAggregationInput = {
    cat_id?: SortOrder
    fk_parent?: SortOrderInput | SortOrder
    cat_code?: SortOrderInput | SortOrder
    cat_label?: SortOrderInput | SortOrder
    _count?: categorieCountOrderByAggregateInput
    _avg?: categorieAvgOrderByAggregateInput
    _max?: categorieMaxOrderByAggregateInput
    _min?: categorieMinOrderByAggregateInput
    _sum?: categorieSumOrderByAggregateInput
  }

  export type categorieScalarWhereWithAggregatesInput = {
    AND?: categorieScalarWhereWithAggregatesInput | categorieScalarWhereWithAggregatesInput[]
    OR?: categorieScalarWhereWithAggregatesInput[]
    NOT?: categorieScalarWhereWithAggregatesInput | categorieScalarWhereWithAggregatesInput[]
    cat_id?: IntWithAggregatesFilter<"categorie"> | number
    fk_parent?: IntNullableWithAggregatesFilter<"categorie"> | number | null
    cat_code?: StringNullableWithAggregatesFilter<"categorie"> | string | null
    cat_label?: StringNullableWithAggregatesFilter<"categorie"> | string | null
  }

  export type categorie_attribut_cenov_dev_ewanWhereInput = {
    AND?: categorie_attribut_cenov_dev_ewanWhereInput | categorie_attribut_cenov_dev_ewanWhereInput[]
    OR?: categorie_attribut_cenov_dev_ewanWhereInput[]
    NOT?: categorie_attribut_cenov_dev_ewanWhereInput | categorie_attribut_cenov_dev_ewanWhereInput[]
    fk_categorie?: IntFilter<"categorie_attribut_cenov_dev_ewan"> | number
    fk_attribute?: IntFilter<"categorie_attribut_cenov_dev_ewan"> | number
    attribut?: XOR<Attribut_cenov_dev_ewanScalarRelationFilter, attribut_cenov_dev_ewanWhereInput>
    categorie?: XOR<CategorieScalarRelationFilter, categorieWhereInput>
  }

  export type categorie_attribut_cenov_dev_ewanOrderByWithRelationInput = {
    fk_categorie?: SortOrder
    fk_attribute?: SortOrder
    attribut?: attribut_cenov_dev_ewanOrderByWithRelationInput
    categorie?: categorieOrderByWithRelationInput
  }

  export type categorie_attribut_cenov_dev_ewanWhereUniqueInput = Prisma.AtLeast<{
    fk_categorie_fk_attribute?: categorie_attribut_cenov_dev_ewanFk_categorieFk_attributeCompoundUniqueInput
    AND?: categorie_attribut_cenov_dev_ewanWhereInput | categorie_attribut_cenov_dev_ewanWhereInput[]
    OR?: categorie_attribut_cenov_dev_ewanWhereInput[]
    NOT?: categorie_attribut_cenov_dev_ewanWhereInput | categorie_attribut_cenov_dev_ewanWhereInput[]
    fk_categorie?: IntFilter<"categorie_attribut_cenov_dev_ewan"> | number
    fk_attribute?: IntFilter<"categorie_attribut_cenov_dev_ewan"> | number
    attribut?: XOR<Attribut_cenov_dev_ewanScalarRelationFilter, attribut_cenov_dev_ewanWhereInput>
    categorie?: XOR<CategorieScalarRelationFilter, categorieWhereInput>
  }, "fk_categorie_fk_attribute">

  export type categorie_attribut_cenov_dev_ewanOrderByWithAggregationInput = {
    fk_categorie?: SortOrder
    fk_attribute?: SortOrder
    _count?: categorie_attribut_cenov_dev_ewanCountOrderByAggregateInput
    _avg?: categorie_attribut_cenov_dev_ewanAvgOrderByAggregateInput
    _max?: categorie_attribut_cenov_dev_ewanMaxOrderByAggregateInput
    _min?: categorie_attribut_cenov_dev_ewanMinOrderByAggregateInput
    _sum?: categorie_attribut_cenov_dev_ewanSumOrderByAggregateInput
  }

  export type categorie_attribut_cenov_dev_ewanScalarWhereWithAggregatesInput = {
    AND?: categorie_attribut_cenov_dev_ewanScalarWhereWithAggregatesInput | categorie_attribut_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    OR?: categorie_attribut_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    NOT?: categorie_attribut_cenov_dev_ewanScalarWhereWithAggregatesInput | categorie_attribut_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    fk_categorie?: IntWithAggregatesFilter<"categorie_attribut_cenov_dev_ewan"> | number
    fk_attribute?: IntWithAggregatesFilter<"categorie_attribut_cenov_dev_ewan"> | number
  }

  export type cross_refWhereInput = {
    AND?: cross_refWhereInput | cross_refWhereInput[]
    OR?: cross_refWhereInput[]
    NOT?: cross_refWhereInput | cross_refWhereInput[]
    crf_id?: IntFilter<"cross_ref"> | number
    fk_produit?: IntFilter<"cross_ref"> | number
    produit?: XOR<ProduitScalarRelationFilter, produitWhereInput>
  }

  export type cross_refOrderByWithRelationInput = {
    crf_id?: SortOrder
    fk_produit?: SortOrder
    produit?: produitOrderByWithRelationInput
  }

  export type cross_refWhereUniqueInput = Prisma.AtLeast<{
    crf_id_fk_produit?: cross_refCrf_idFk_produitCompoundUniqueInput
    AND?: cross_refWhereInput | cross_refWhereInput[]
    OR?: cross_refWhereInput[]
    NOT?: cross_refWhereInput | cross_refWhereInput[]
    crf_id?: IntFilter<"cross_ref"> | number
    fk_produit?: IntFilter<"cross_ref"> | number
    produit?: XOR<ProduitScalarRelationFilter, produitWhereInput>
  }, "crf_id_fk_produit">

  export type cross_refOrderByWithAggregationInput = {
    crf_id?: SortOrder
    fk_produit?: SortOrder
    _count?: cross_refCountOrderByAggregateInput
    _avg?: cross_refAvgOrderByAggregateInput
    _max?: cross_refMaxOrderByAggregateInput
    _min?: cross_refMinOrderByAggregateInput
    _sum?: cross_refSumOrderByAggregateInput
  }

  export type cross_refScalarWhereWithAggregatesInput = {
    AND?: cross_refScalarWhereWithAggregatesInput | cross_refScalarWhereWithAggregatesInput[]
    OR?: cross_refScalarWhereWithAggregatesInput[]
    NOT?: cross_refScalarWhereWithAggregatesInput | cross_refScalarWhereWithAggregatesInput[]
    crf_id?: IntWithAggregatesFilter<"cross_ref"> | number
    fk_produit?: IntWithAggregatesFilter<"cross_ref"> | number
  }

  export type familleWhereInput = {
    AND?: familleWhereInput | familleWhereInput[]
    OR?: familleWhereInput[]
    NOT?: familleWhereInput | familleWhereInput[]
    fam_id?: IntFilter<"famille"> | number
    fk_parent?: IntNullableFilter<"famille"> | number | null
    fam_code?: StringNullableFilter<"famille"> | string | null
    fam_label?: StringNullableFilter<"famille"> | string | null
    fk_supplier?: IntFilter<"famille"> | number
    fournisseur?: XOR<FournisseurScalarRelationFilter, fournisseurWhereInput>
    famille?: XOR<FamilleNullableScalarRelationFilter, familleWhereInput> | null
    other_famille?: FamilleListRelationFilter
  }

  export type familleOrderByWithRelationInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrderInput | SortOrder
    fam_code?: SortOrderInput | SortOrder
    fam_label?: SortOrderInput | SortOrder
    fk_supplier?: SortOrder
    fournisseur?: fournisseurOrderByWithRelationInput
    famille?: familleOrderByWithRelationInput
    other_famille?: familleOrderByRelationAggregateInput
  }

  export type familleWhereUniqueInput = Prisma.AtLeast<{
    fam_id?: number
    fk_parent_fam_code?: familleFk_parentFam_codeCompoundUniqueInput
    AND?: familleWhereInput | familleWhereInput[]
    OR?: familleWhereInput[]
    NOT?: familleWhereInput | familleWhereInput[]
    fk_parent?: IntNullableFilter<"famille"> | number | null
    fam_code?: StringNullableFilter<"famille"> | string | null
    fam_label?: StringNullableFilter<"famille"> | string | null
    fk_supplier?: IntFilter<"famille"> | number
    fournisseur?: XOR<FournisseurScalarRelationFilter, fournisseurWhereInput>
    famille?: XOR<FamilleNullableScalarRelationFilter, familleWhereInput> | null
    other_famille?: FamilleListRelationFilter
  }, "fam_id" | "fk_parent_fam_code">

  export type familleOrderByWithAggregationInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrderInput | SortOrder
    fam_code?: SortOrderInput | SortOrder
    fam_label?: SortOrderInput | SortOrder
    fk_supplier?: SortOrder
    _count?: familleCountOrderByAggregateInput
    _avg?: familleAvgOrderByAggregateInput
    _max?: familleMaxOrderByAggregateInput
    _min?: familleMinOrderByAggregateInput
    _sum?: familleSumOrderByAggregateInput
  }

  export type familleScalarWhereWithAggregatesInput = {
    AND?: familleScalarWhereWithAggregatesInput | familleScalarWhereWithAggregatesInput[]
    OR?: familleScalarWhereWithAggregatesInput[]
    NOT?: familleScalarWhereWithAggregatesInput | familleScalarWhereWithAggregatesInput[]
    fam_id?: IntWithAggregatesFilter<"famille"> | number
    fk_parent?: IntNullableWithAggregatesFilter<"famille"> | number | null
    fam_code?: StringNullableWithAggregatesFilter<"famille"> | string | null
    fam_label?: StringNullableWithAggregatesFilter<"famille"> | string | null
    fk_supplier?: IntWithAggregatesFilter<"famille"> | number
  }

  export type produitWhereInput = {
    AND?: produitWhereInput | produitWhereInput[]
    OR?: produitWhereInput[]
    NOT?: produitWhereInput | produitWhereInput[]
    pro_id?: IntFilter<"produit"> | number
    pro_code?: StringNullableFilter<"produit"> | string | null
    fk_supplier?: IntNullableFilter<"produit"> | number | null
    fk_kit?: IntNullableFilter<"produit"> | number | null
    fk_famille?: IntNullableFilter<"produit"> | number | null
    fk_sfamille?: IntNullableFilter<"produit"> | number | null
    fk_ssfamille?: IntNullableFilter<"produit"> | number | null
    created_at?: DateTimeNullableFilter<"produit"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"produit"> | Date | string | null
    cross_ref?: Cross_refListRelationFilter
    kit?: XOR<Kit_cenov_dev_ewanNullableScalarRelationFilter, kit_cenov_dev_ewanWhereInput> | null
    fournisseur?: XOR<FournisseurNullableScalarRelationFilter, fournisseurWhereInput> | null
    produit_categorie?: Produit_categorie_cenov_dev_ewanListRelationFilter
    tarif_achat?: Tarif_achat_cenov_dev_ewanListRelationFilter
  }

  export type produitOrderByWithRelationInput = {
    pro_id?: SortOrder
    pro_code?: SortOrderInput | SortOrder
    fk_supplier?: SortOrderInput | SortOrder
    fk_kit?: SortOrderInput | SortOrder
    fk_famille?: SortOrderInput | SortOrder
    fk_sfamille?: SortOrderInput | SortOrder
    fk_ssfamille?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    cross_ref?: cross_refOrderByRelationAggregateInput
    kit?: kit_cenov_dev_ewanOrderByWithRelationInput
    fournisseur?: fournisseurOrderByWithRelationInput
    produit_categorie?: produit_categorie_cenov_dev_ewanOrderByRelationAggregateInput
    tarif_achat?: tarif_achat_cenov_dev_ewanOrderByRelationAggregateInput
  }

  export type produitWhereUniqueInput = Prisma.AtLeast<{
    pro_id?: number
    AND?: produitWhereInput | produitWhereInput[]
    OR?: produitWhereInput[]
    NOT?: produitWhereInput | produitWhereInput[]
    pro_code?: StringNullableFilter<"produit"> | string | null
    fk_supplier?: IntNullableFilter<"produit"> | number | null
    fk_kit?: IntNullableFilter<"produit"> | number | null
    fk_famille?: IntNullableFilter<"produit"> | number | null
    fk_sfamille?: IntNullableFilter<"produit"> | number | null
    fk_ssfamille?: IntNullableFilter<"produit"> | number | null
    created_at?: DateTimeNullableFilter<"produit"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"produit"> | Date | string | null
    cross_ref?: Cross_refListRelationFilter
    kit?: XOR<Kit_cenov_dev_ewanNullableScalarRelationFilter, kit_cenov_dev_ewanWhereInput> | null
    fournisseur?: XOR<FournisseurNullableScalarRelationFilter, fournisseurWhereInput> | null
    produit_categorie?: Produit_categorie_cenov_dev_ewanListRelationFilter
    tarif_achat?: Tarif_achat_cenov_dev_ewanListRelationFilter
  }, "pro_id">

  export type produitOrderByWithAggregationInput = {
    pro_id?: SortOrder
    pro_code?: SortOrderInput | SortOrder
    fk_supplier?: SortOrderInput | SortOrder
    fk_kit?: SortOrderInput | SortOrder
    fk_famille?: SortOrderInput | SortOrder
    fk_sfamille?: SortOrderInput | SortOrder
    fk_ssfamille?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: produitCountOrderByAggregateInput
    _avg?: produitAvgOrderByAggregateInput
    _max?: produitMaxOrderByAggregateInput
    _min?: produitMinOrderByAggregateInput
    _sum?: produitSumOrderByAggregateInput
  }

  export type produitScalarWhereWithAggregatesInput = {
    AND?: produitScalarWhereWithAggregatesInput | produitScalarWhereWithAggregatesInput[]
    OR?: produitScalarWhereWithAggregatesInput[]
    NOT?: produitScalarWhereWithAggregatesInput | produitScalarWhereWithAggregatesInput[]
    pro_id?: IntWithAggregatesFilter<"produit"> | number
    pro_code?: StringNullableWithAggregatesFilter<"produit"> | string | null
    fk_supplier?: IntNullableWithAggregatesFilter<"produit"> | number | null
    fk_kit?: IntNullableWithAggregatesFilter<"produit"> | number | null
    fk_famille?: IntNullableWithAggregatesFilter<"produit"> | number | null
    fk_sfamille?: IntNullableWithAggregatesFilter<"produit"> | number | null
    fk_ssfamille?: IntNullableWithAggregatesFilter<"produit"> | number | null
    created_at?: DateTimeNullableWithAggregatesFilter<"produit"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"produit"> | Date | string | null
  }

  export type produit_categorie_cenov_dev_ewanWhereInput = {
    AND?: produit_categorie_cenov_dev_ewanWhereInput | produit_categorie_cenov_dev_ewanWhereInput[]
    OR?: produit_categorie_cenov_dev_ewanWhereInput[]
    NOT?: produit_categorie_cenov_dev_ewanWhereInput | produit_categorie_cenov_dev_ewanWhereInput[]
    fk_produit?: IntFilter<"produit_categorie_cenov_dev_ewan"> | number
    fk_categorie?: IntFilter<"produit_categorie_cenov_dev_ewan"> | number
    categorie?: XOR<CategorieScalarRelationFilter, categorieWhereInput>
    produit?: XOR<ProduitScalarRelationFilter, produitWhereInput>
  }

  export type produit_categorie_cenov_dev_ewanOrderByWithRelationInput = {
    fk_produit?: SortOrder
    fk_categorie?: SortOrder
    categorie?: categorieOrderByWithRelationInput
    produit?: produitOrderByWithRelationInput
  }

  export type produit_categorie_cenov_dev_ewanWhereUniqueInput = Prisma.AtLeast<{
    fk_produit_fk_categorie?: produit_categorie_cenov_dev_ewanFk_produitFk_categorieCompoundUniqueInput
    AND?: produit_categorie_cenov_dev_ewanWhereInput | produit_categorie_cenov_dev_ewanWhereInput[]
    OR?: produit_categorie_cenov_dev_ewanWhereInput[]
    NOT?: produit_categorie_cenov_dev_ewanWhereInput | produit_categorie_cenov_dev_ewanWhereInput[]
    fk_produit?: IntFilter<"produit_categorie_cenov_dev_ewan"> | number
    fk_categorie?: IntFilter<"produit_categorie_cenov_dev_ewan"> | number
    categorie?: XOR<CategorieScalarRelationFilter, categorieWhereInput>
    produit?: XOR<ProduitScalarRelationFilter, produitWhereInput>
  }, "fk_produit_fk_categorie">

  export type produit_categorie_cenov_dev_ewanOrderByWithAggregationInput = {
    fk_produit?: SortOrder
    fk_categorie?: SortOrder
    _count?: produit_categorie_cenov_dev_ewanCountOrderByAggregateInput
    _avg?: produit_categorie_cenov_dev_ewanAvgOrderByAggregateInput
    _max?: produit_categorie_cenov_dev_ewanMaxOrderByAggregateInput
    _min?: produit_categorie_cenov_dev_ewanMinOrderByAggregateInput
    _sum?: produit_categorie_cenov_dev_ewanSumOrderByAggregateInput
  }

  export type produit_categorie_cenov_dev_ewanScalarWhereWithAggregatesInput = {
    AND?: produit_categorie_cenov_dev_ewanScalarWhereWithAggregatesInput | produit_categorie_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    OR?: produit_categorie_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    NOT?: produit_categorie_cenov_dev_ewanScalarWhereWithAggregatesInput | produit_categorie_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    fk_produit?: IntWithAggregatesFilter<"produit_categorie_cenov_dev_ewan"> | number
    fk_categorie?: IntWithAggregatesFilter<"produit_categorie_cenov_dev_ewan"> | number
  }

  export type tarif_achat_cenov_dev_ewanWhereInput = {
    AND?: tarif_achat_cenov_dev_ewanWhereInput | tarif_achat_cenov_dev_ewanWhereInput[]
    OR?: tarif_achat_cenov_dev_ewanWhereInput[]
    NOT?: tarif_achat_cenov_dev_ewanWhereInput | tarif_achat_cenov_dev_ewanWhereInput[]
    fk_produit?: IntFilter<"tarif_achat_cenov_dev_ewan"> | number
    taa_date?: DateTimeFilter<"tarif_achat_cenov_dev_ewan"> | Date | string
    taa_montant?: FloatNullableFilter<"tarif_achat_cenov_dev_ewan"> | number | null
    taa_remise?: FloatNullableFilter<"tarif_achat_cenov_dev_ewan"> | number | null
    taa_montant_net?: FloatNullableFilter<"tarif_achat_cenov_dev_ewan"> | number | null
    produit?: XOR<ProduitScalarRelationFilter, produitWhereInput>
  }

  export type tarif_achat_cenov_dev_ewanOrderByWithRelationInput = {
    fk_produit?: SortOrder
    taa_date?: SortOrder
    taa_montant?: SortOrderInput | SortOrder
    taa_remise?: SortOrderInput | SortOrder
    taa_montant_net?: SortOrderInput | SortOrder
    produit?: produitOrderByWithRelationInput
  }

  export type tarif_achat_cenov_dev_ewanWhereUniqueInput = Prisma.AtLeast<{
    fk_produit_taa_date?: tarif_achat_cenov_dev_ewanFk_produitTaa_dateCompoundUniqueInput
    AND?: tarif_achat_cenov_dev_ewanWhereInput | tarif_achat_cenov_dev_ewanWhereInput[]
    OR?: tarif_achat_cenov_dev_ewanWhereInput[]
    NOT?: tarif_achat_cenov_dev_ewanWhereInput | tarif_achat_cenov_dev_ewanWhereInput[]
    fk_produit?: IntFilter<"tarif_achat_cenov_dev_ewan"> | number
    taa_date?: DateTimeFilter<"tarif_achat_cenov_dev_ewan"> | Date | string
    taa_montant?: FloatNullableFilter<"tarif_achat_cenov_dev_ewan"> | number | null
    taa_remise?: FloatNullableFilter<"tarif_achat_cenov_dev_ewan"> | number | null
    taa_montant_net?: FloatNullableFilter<"tarif_achat_cenov_dev_ewan"> | number | null
    produit?: XOR<ProduitScalarRelationFilter, produitWhereInput>
  }, "fk_produit_taa_date">

  export type tarif_achat_cenov_dev_ewanOrderByWithAggregationInput = {
    fk_produit?: SortOrder
    taa_date?: SortOrder
    taa_montant?: SortOrderInput | SortOrder
    taa_remise?: SortOrderInput | SortOrder
    taa_montant_net?: SortOrderInput | SortOrder
    _count?: tarif_achat_cenov_dev_ewanCountOrderByAggregateInput
    _avg?: tarif_achat_cenov_dev_ewanAvgOrderByAggregateInput
    _max?: tarif_achat_cenov_dev_ewanMaxOrderByAggregateInput
    _min?: tarif_achat_cenov_dev_ewanMinOrderByAggregateInput
    _sum?: tarif_achat_cenov_dev_ewanSumOrderByAggregateInput
  }

  export type tarif_achat_cenov_dev_ewanScalarWhereWithAggregatesInput = {
    AND?: tarif_achat_cenov_dev_ewanScalarWhereWithAggregatesInput | tarif_achat_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    OR?: tarif_achat_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    NOT?: tarif_achat_cenov_dev_ewanScalarWhereWithAggregatesInput | tarif_achat_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    fk_produit?: IntWithAggregatesFilter<"tarif_achat_cenov_dev_ewan"> | number
    taa_date?: DateTimeWithAggregatesFilter<"tarif_achat_cenov_dev_ewan"> | Date | string
    taa_montant?: FloatNullableWithAggregatesFilter<"tarif_achat_cenov_dev_ewan"> | number | null
    taa_remise?: FloatNullableWithAggregatesFilter<"tarif_achat_cenov_dev_ewan"> | number | null
    taa_montant_net?: FloatNullableWithAggregatesFilter<"tarif_achat_cenov_dev_ewan"> | number | null
  }

  export type attribut_cenov_dev_ewanWhereInput = {
    AND?: attribut_cenov_dev_ewanWhereInput | attribut_cenov_dev_ewanWhereInput[]
    OR?: attribut_cenov_dev_ewanWhereInput[]
    NOT?: attribut_cenov_dev_ewanWhereInput | attribut_cenov_dev_ewanWhereInput[]
    atr_id?: IntFilter<"attribut_cenov_dev_ewan"> | number
    atr_nat?: StringNullableFilter<"attribut_cenov_dev_ewan"> | string | null
    atr_val?: StringNullableFilter<"attribut_cenov_dev_ewan"> | string | null
    atr_label?: StringNullableFilter<"attribut_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableFilter<"attribut_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"attribut_cenov_dev_ewan"> | Date | string | null
    categorie_attribut?: Categorie_attribut_cenov_dev_ewanListRelationFilter
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: Kit_attribute_cenov_dev_ewanListRelationFilter
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: Kit_attribute_cenov_dev_ewanListRelationFilter
  }

  export type attribut_cenov_dev_ewanOrderByWithRelationInput = {
    atr_id?: SortOrder
    atr_nat?: SortOrderInput | SortOrder
    atr_val?: SortOrderInput | SortOrder
    atr_label?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    categorie_attribut?: categorie_attribut_cenov_dev_ewanOrderByRelationAggregateInput
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanOrderByRelationAggregateInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanOrderByRelationAggregateInput
  }

  export type attribut_cenov_dev_ewanWhereUniqueInput = Prisma.AtLeast<{
    atr_id?: number
    atr_nat_atr_val?: attribut_cenov_dev_ewanAtr_natAtr_valCompoundUniqueInput
    AND?: attribut_cenov_dev_ewanWhereInput | attribut_cenov_dev_ewanWhereInput[]
    OR?: attribut_cenov_dev_ewanWhereInput[]
    NOT?: attribut_cenov_dev_ewanWhereInput | attribut_cenov_dev_ewanWhereInput[]
    atr_nat?: StringNullableFilter<"attribut_cenov_dev_ewan"> | string | null
    atr_val?: StringNullableFilter<"attribut_cenov_dev_ewan"> | string | null
    atr_label?: StringNullableFilter<"attribut_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableFilter<"attribut_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"attribut_cenov_dev_ewan"> | Date | string | null
    categorie_attribut?: Categorie_attribut_cenov_dev_ewanListRelationFilter
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: Kit_attribute_cenov_dev_ewanListRelationFilter
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: Kit_attribute_cenov_dev_ewanListRelationFilter
  }, "atr_id" | "atr_nat_atr_val">

  export type attribut_cenov_dev_ewanOrderByWithAggregationInput = {
    atr_id?: SortOrder
    atr_nat?: SortOrderInput | SortOrder
    atr_val?: SortOrderInput | SortOrder
    atr_label?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: attribut_cenov_dev_ewanCountOrderByAggregateInput
    _avg?: attribut_cenov_dev_ewanAvgOrderByAggregateInput
    _max?: attribut_cenov_dev_ewanMaxOrderByAggregateInput
    _min?: attribut_cenov_dev_ewanMinOrderByAggregateInput
    _sum?: attribut_cenov_dev_ewanSumOrderByAggregateInput
  }

  export type attribut_cenov_dev_ewanScalarWhereWithAggregatesInput = {
    AND?: attribut_cenov_dev_ewanScalarWhereWithAggregatesInput | attribut_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    OR?: attribut_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    NOT?: attribut_cenov_dev_ewanScalarWhereWithAggregatesInput | attribut_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    atr_id?: IntWithAggregatesFilter<"attribut_cenov_dev_ewan"> | number
    atr_nat?: StringNullableWithAggregatesFilter<"attribut_cenov_dev_ewan"> | string | null
    atr_val?: StringNullableWithAggregatesFilter<"attribut_cenov_dev_ewan"> | string | null
    atr_label?: StringNullableWithAggregatesFilter<"attribut_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"attribut_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"attribut_cenov_dev_ewan"> | Date | string | null
  }

  export type fournisseurWhereInput = {
    AND?: fournisseurWhereInput | fournisseurWhereInput[]
    OR?: fournisseurWhereInput[]
    NOT?: fournisseurWhereInput | fournisseurWhereInput[]
    frs_id?: IntFilter<"fournisseur"> | number
    frs_code?: StringFilter<"fournisseur"> | string
    frs_label?: StringNullableFilter<"fournisseur"> | string | null
    famille?: FamilleListRelationFilter
    produit?: ProduitListRelationFilter
  }

  export type fournisseurOrderByWithRelationInput = {
    frs_id?: SortOrder
    frs_code?: SortOrder
    frs_label?: SortOrderInput | SortOrder
    famille?: familleOrderByRelationAggregateInput
    produit?: produitOrderByRelationAggregateInput
  }

  export type fournisseurWhereUniqueInput = Prisma.AtLeast<{
    frs_id?: number
    AND?: fournisseurWhereInput | fournisseurWhereInput[]
    OR?: fournisseurWhereInput[]
    NOT?: fournisseurWhereInput | fournisseurWhereInput[]
    frs_code?: StringFilter<"fournisseur"> | string
    frs_label?: StringNullableFilter<"fournisseur"> | string | null
    famille?: FamilleListRelationFilter
    produit?: ProduitListRelationFilter
  }, "frs_id">

  export type fournisseurOrderByWithAggregationInput = {
    frs_id?: SortOrder
    frs_code?: SortOrder
    frs_label?: SortOrderInput | SortOrder
    _count?: fournisseurCountOrderByAggregateInput
    _avg?: fournisseurAvgOrderByAggregateInput
    _max?: fournisseurMaxOrderByAggregateInput
    _min?: fournisseurMinOrderByAggregateInput
    _sum?: fournisseurSumOrderByAggregateInput
  }

  export type fournisseurScalarWhereWithAggregatesInput = {
    AND?: fournisseurScalarWhereWithAggregatesInput | fournisseurScalarWhereWithAggregatesInput[]
    OR?: fournisseurScalarWhereWithAggregatesInput[]
    NOT?: fournisseurScalarWhereWithAggregatesInput | fournisseurScalarWhereWithAggregatesInput[]
    frs_id?: IntWithAggregatesFilter<"fournisseur"> | number
    frs_code?: StringWithAggregatesFilter<"fournisseur"> | string
    frs_label?: StringNullableWithAggregatesFilter<"fournisseur"> | string | null
  }

  export type kit_cenov_dev_ewanWhereInput = {
    AND?: kit_cenov_dev_ewanWhereInput | kit_cenov_dev_ewanWhereInput[]
    OR?: kit_cenov_dev_ewanWhereInput[]
    NOT?: kit_cenov_dev_ewanWhereInput | kit_cenov_dev_ewanWhereInput[]
    kit_id?: IntFilter<"kit_cenov_dev_ewan"> | number
    kit_label?: StringNullableFilter<"kit_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableFilter<"kit_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"kit_cenov_dev_ewan"> | Date | string | null
    produit?: ProduitListRelationFilter
    kit_attribute?: Kit_attribute_cenov_dev_ewanListRelationFilter
    part_nc?: Part_nc_cenov_dev_ewanListRelationFilter
  }

  export type kit_cenov_dev_ewanOrderByWithRelationInput = {
    kit_id?: SortOrder
    kit_label?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    produit?: produitOrderByRelationAggregateInput
    kit_attribute?: kit_attribute_cenov_dev_ewanOrderByRelationAggregateInput
    part_nc?: part_nc_cenov_dev_ewanOrderByRelationAggregateInput
  }

  export type kit_cenov_dev_ewanWhereUniqueInput = Prisma.AtLeast<{
    kit_id?: number
    AND?: kit_cenov_dev_ewanWhereInput | kit_cenov_dev_ewanWhereInput[]
    OR?: kit_cenov_dev_ewanWhereInput[]
    NOT?: kit_cenov_dev_ewanWhereInput | kit_cenov_dev_ewanWhereInput[]
    kit_label?: StringNullableFilter<"kit_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableFilter<"kit_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"kit_cenov_dev_ewan"> | Date | string | null
    produit?: ProduitListRelationFilter
    kit_attribute?: Kit_attribute_cenov_dev_ewanListRelationFilter
    part_nc?: Part_nc_cenov_dev_ewanListRelationFilter
  }, "kit_id">

  export type kit_cenov_dev_ewanOrderByWithAggregationInput = {
    kit_id?: SortOrder
    kit_label?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: kit_cenov_dev_ewanCountOrderByAggregateInput
    _avg?: kit_cenov_dev_ewanAvgOrderByAggregateInput
    _max?: kit_cenov_dev_ewanMaxOrderByAggregateInput
    _min?: kit_cenov_dev_ewanMinOrderByAggregateInput
    _sum?: kit_cenov_dev_ewanSumOrderByAggregateInput
  }

  export type kit_cenov_dev_ewanScalarWhereWithAggregatesInput = {
    AND?: kit_cenov_dev_ewanScalarWhereWithAggregatesInput | kit_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    OR?: kit_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    NOT?: kit_cenov_dev_ewanScalarWhereWithAggregatesInput | kit_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    kit_id?: IntWithAggregatesFilter<"kit_cenov_dev_ewan"> | number
    kit_label?: StringNullableWithAggregatesFilter<"kit_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"kit_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"kit_cenov_dev_ewan"> | Date | string | null
  }

  export type kit_attribute_cenov_dev_ewanWhereInput = {
    AND?: kit_attribute_cenov_dev_ewanWhereInput | kit_attribute_cenov_dev_ewanWhereInput[]
    OR?: kit_attribute_cenov_dev_ewanWhereInput[]
    NOT?: kit_attribute_cenov_dev_ewanWhereInput | kit_attribute_cenov_dev_ewanWhereInput[]
    fk_kit?: IntNullableFilter<"kit_attribute_cenov_dev_ewan"> | number | null
    fk_attribute_carac?: IntNullableFilter<"kit_attribute_cenov_dev_ewan"> | number | null
    fk_attribute_unit?: IntNullableFilter<"kit_attribute_cenov_dev_ewan"> | number | null
    kat_valeur?: StringNullableFilter<"kit_attribute_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableFilter<"kit_attribute_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"kit_attribute_cenov_dev_ewan"> | Date | string | null
    kat_id?: IntFilter<"kit_attribute_cenov_dev_ewan"> | number
    attribut_kit_attribute_fk_attribute_caracToattribut?: XOR<Attribut_cenov_dev_ewanNullableScalarRelationFilter, attribut_cenov_dev_ewanWhereInput> | null
    attribut_kit_attribute_fk_attribute_unitToattribut?: XOR<Attribut_cenov_dev_ewanNullableScalarRelationFilter, attribut_cenov_dev_ewanWhereInput> | null
    kit?: XOR<Kit_cenov_dev_ewanNullableScalarRelationFilter, kit_cenov_dev_ewanWhereInput> | null
  }

  export type kit_attribute_cenov_dev_ewanOrderByWithRelationInput = {
    fk_kit?: SortOrderInput | SortOrder
    fk_attribute_carac?: SortOrderInput | SortOrder
    fk_attribute_unit?: SortOrderInput | SortOrder
    kat_valeur?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    kat_id?: SortOrder
    attribut_kit_attribute_fk_attribute_caracToattribut?: attribut_cenov_dev_ewanOrderByWithRelationInput
    attribut_kit_attribute_fk_attribute_unitToattribut?: attribut_cenov_dev_ewanOrderByWithRelationInput
    kit?: kit_cenov_dev_ewanOrderByWithRelationInput
  }

  export type kit_attribute_cenov_dev_ewanWhereUniqueInput = Prisma.AtLeast<{
    kat_id?: number
    AND?: kit_attribute_cenov_dev_ewanWhereInput | kit_attribute_cenov_dev_ewanWhereInput[]
    OR?: kit_attribute_cenov_dev_ewanWhereInput[]
    NOT?: kit_attribute_cenov_dev_ewanWhereInput | kit_attribute_cenov_dev_ewanWhereInput[]
    fk_kit?: IntNullableFilter<"kit_attribute_cenov_dev_ewan"> | number | null
    fk_attribute_carac?: IntNullableFilter<"kit_attribute_cenov_dev_ewan"> | number | null
    fk_attribute_unit?: IntNullableFilter<"kit_attribute_cenov_dev_ewan"> | number | null
    kat_valeur?: StringNullableFilter<"kit_attribute_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableFilter<"kit_attribute_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"kit_attribute_cenov_dev_ewan"> | Date | string | null
    attribut_kit_attribute_fk_attribute_caracToattribut?: XOR<Attribut_cenov_dev_ewanNullableScalarRelationFilter, attribut_cenov_dev_ewanWhereInput> | null
    attribut_kit_attribute_fk_attribute_unitToattribut?: XOR<Attribut_cenov_dev_ewanNullableScalarRelationFilter, attribut_cenov_dev_ewanWhereInput> | null
    kit?: XOR<Kit_cenov_dev_ewanNullableScalarRelationFilter, kit_cenov_dev_ewanWhereInput> | null
  }, "kat_id">

  export type kit_attribute_cenov_dev_ewanOrderByWithAggregationInput = {
    fk_kit?: SortOrderInput | SortOrder
    fk_attribute_carac?: SortOrderInput | SortOrder
    fk_attribute_unit?: SortOrderInput | SortOrder
    kat_valeur?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    kat_id?: SortOrder
    _count?: kit_attribute_cenov_dev_ewanCountOrderByAggregateInput
    _avg?: kit_attribute_cenov_dev_ewanAvgOrderByAggregateInput
    _max?: kit_attribute_cenov_dev_ewanMaxOrderByAggregateInput
    _min?: kit_attribute_cenov_dev_ewanMinOrderByAggregateInput
    _sum?: kit_attribute_cenov_dev_ewanSumOrderByAggregateInput
  }

  export type kit_attribute_cenov_dev_ewanScalarWhereWithAggregatesInput = {
    AND?: kit_attribute_cenov_dev_ewanScalarWhereWithAggregatesInput | kit_attribute_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    OR?: kit_attribute_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    NOT?: kit_attribute_cenov_dev_ewanScalarWhereWithAggregatesInput | kit_attribute_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    fk_kit?: IntNullableWithAggregatesFilter<"kit_attribute_cenov_dev_ewan"> | number | null
    fk_attribute_carac?: IntNullableWithAggregatesFilter<"kit_attribute_cenov_dev_ewan"> | number | null
    fk_attribute_unit?: IntNullableWithAggregatesFilter<"kit_attribute_cenov_dev_ewan"> | number | null
    kat_valeur?: StringNullableWithAggregatesFilter<"kit_attribute_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"kit_attribute_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"kit_attribute_cenov_dev_ewan"> | Date | string | null
    kat_id?: IntWithAggregatesFilter<"kit_attribute_cenov_dev_ewan"> | number
  }

  export type part_nc_cenov_dev_ewanWhereInput = {
    AND?: part_nc_cenov_dev_ewanWhereInput | part_nc_cenov_dev_ewanWhereInput[]
    OR?: part_nc_cenov_dev_ewanWhereInput[]
    NOT?: part_nc_cenov_dev_ewanWhereInput | part_nc_cenov_dev_ewanWhereInput[]
    par_id?: IntFilter<"part_nc_cenov_dev_ewan"> | number
    fk_kit?: IntNullableFilter<"part_nc_cenov_dev_ewan"> | number | null
    par_label?: StringNullableFilter<"part_nc_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableFilter<"part_nc_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"part_nc_cenov_dev_ewan"> | Date | string | null
    kit?: XOR<Kit_cenov_dev_ewanNullableScalarRelationFilter, kit_cenov_dev_ewanWhereInput> | null
  }

  export type part_nc_cenov_dev_ewanOrderByWithRelationInput = {
    par_id?: SortOrder
    fk_kit?: SortOrderInput | SortOrder
    par_label?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    kit?: kit_cenov_dev_ewanOrderByWithRelationInput
  }

  export type part_nc_cenov_dev_ewanWhereUniqueInput = Prisma.AtLeast<{
    par_id?: number
    AND?: part_nc_cenov_dev_ewanWhereInput | part_nc_cenov_dev_ewanWhereInput[]
    OR?: part_nc_cenov_dev_ewanWhereInput[]
    NOT?: part_nc_cenov_dev_ewanWhereInput | part_nc_cenov_dev_ewanWhereInput[]
    fk_kit?: IntNullableFilter<"part_nc_cenov_dev_ewan"> | number | null
    par_label?: StringNullableFilter<"part_nc_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableFilter<"part_nc_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"part_nc_cenov_dev_ewan"> | Date | string | null
    kit?: XOR<Kit_cenov_dev_ewanNullableScalarRelationFilter, kit_cenov_dev_ewanWhereInput> | null
  }, "par_id">

  export type part_nc_cenov_dev_ewanOrderByWithAggregationInput = {
    par_id?: SortOrder
    fk_kit?: SortOrderInput | SortOrder
    par_label?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    _count?: part_nc_cenov_dev_ewanCountOrderByAggregateInput
    _avg?: part_nc_cenov_dev_ewanAvgOrderByAggregateInput
    _max?: part_nc_cenov_dev_ewanMaxOrderByAggregateInput
    _min?: part_nc_cenov_dev_ewanMinOrderByAggregateInput
    _sum?: part_nc_cenov_dev_ewanSumOrderByAggregateInput
  }

  export type part_nc_cenov_dev_ewanScalarWhereWithAggregatesInput = {
    AND?: part_nc_cenov_dev_ewanScalarWhereWithAggregatesInput | part_nc_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    OR?: part_nc_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    NOT?: part_nc_cenov_dev_ewanScalarWhereWithAggregatesInput | part_nc_cenov_dev_ewanScalarWhereWithAggregatesInput[]
    par_id?: IntWithAggregatesFilter<"part_nc_cenov_dev_ewan"> | number
    fk_kit?: IntNullableWithAggregatesFilter<"part_nc_cenov_dev_ewan"> | number | null
    par_label?: StringNullableWithAggregatesFilter<"part_nc_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"part_nc_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"part_nc_cenov_dev_ewan"> | Date | string | null
  }

  export type famille_ewanWhereInput = {
    AND?: famille_ewanWhereInput | famille_ewanWhereInput[]
    OR?: famille_ewanWhereInput[]
    NOT?: famille_ewanWhereInput | famille_ewanWhereInput[]
    fam_id?: IntFilter<"famille_ewan"> | number
    fk_parent?: IntNullableFilter<"famille_ewan"> | number | null
    fam_code?: StringNullableFilter<"famille_ewan"> | string | null
    fam_label?: StringNullableFilter<"famille_ewan"> | string | null
    fk_supplier?: IntNullableFilter<"famille_ewan"> | number | null
  }

  export type famille_ewanOrderByWithRelationInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrderInput | SortOrder
    fam_code?: SortOrderInput | SortOrder
    fam_label?: SortOrderInput | SortOrder
    fk_supplier?: SortOrderInput | SortOrder
  }

  export type famille_ewanWhereUniqueInput = Prisma.AtLeast<{
    fam_id?: number
    AND?: famille_ewanWhereInput | famille_ewanWhereInput[]
    OR?: famille_ewanWhereInput[]
    NOT?: famille_ewanWhereInput | famille_ewanWhereInput[]
    fk_parent?: IntNullableFilter<"famille_ewan"> | number | null
    fam_code?: StringNullableFilter<"famille_ewan"> | string | null
    fam_label?: StringNullableFilter<"famille_ewan"> | string | null
    fk_supplier?: IntNullableFilter<"famille_ewan"> | number | null
  }, "fam_id">

  export type famille_ewanOrderByWithAggregationInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrderInput | SortOrder
    fam_code?: SortOrderInput | SortOrder
    fam_label?: SortOrderInput | SortOrder
    fk_supplier?: SortOrderInput | SortOrder
    _count?: famille_ewanCountOrderByAggregateInput
    _avg?: famille_ewanAvgOrderByAggregateInput
    _max?: famille_ewanMaxOrderByAggregateInput
    _min?: famille_ewanMinOrderByAggregateInput
    _sum?: famille_ewanSumOrderByAggregateInput
  }

  export type famille_ewanScalarWhereWithAggregatesInput = {
    AND?: famille_ewanScalarWhereWithAggregatesInput | famille_ewanScalarWhereWithAggregatesInput[]
    OR?: famille_ewanScalarWhereWithAggregatesInput[]
    NOT?: famille_ewanScalarWhereWithAggregatesInput | famille_ewanScalarWhereWithAggregatesInput[]
    fam_id?: IntWithAggregatesFilter<"famille_ewan"> | number
    fk_parent?: IntNullableWithAggregatesFilter<"famille_ewan"> | number | null
    fam_code?: StringNullableWithAggregatesFilter<"famille_ewan"> | string | null
    fam_label?: StringNullableWithAggregatesFilter<"famille_ewan"> | string | null
    fk_supplier?: IntNullableWithAggregatesFilter<"famille_ewan"> | number | null
  }

  export type categorieCreateInput = {
    cat_code?: string | null
    cat_label?: string | null
    categorie?: categorieCreateNestedOneWithoutOther_categorieInput
    other_categorie?: categorieCreateNestedManyWithoutCategorieInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanCreateNestedManyWithoutCategorieInput
    produit_categorie?: produit_categorie_cenov_dev_ewanCreateNestedManyWithoutCategorieInput
  }

  export type categorieUncheckedCreateInput = {
    cat_id?: number
    fk_parent?: number | null
    cat_code?: string | null
    cat_label?: string | null
    other_categorie?: categorieUncheckedCreateNestedManyWithoutCategorieInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedCreateNestedManyWithoutCategorieInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedCreateNestedManyWithoutCategorieInput
  }

  export type categorieUpdateInput = {
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
    categorie?: categorieUpdateOneWithoutOther_categorieNestedInput
    other_categorie?: categorieUpdateManyWithoutCategorieNestedInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUpdateManyWithoutCategorieNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUpdateManyWithoutCategorieNestedInput
  }

  export type categorieUncheckedUpdateInput = {
    cat_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
    other_categorie?: categorieUncheckedUpdateManyWithoutCategorieNestedInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieNestedInput
  }

  export type categorieCreateManyInput = {
    cat_id?: number
    fk_parent?: number | null
    cat_code?: string | null
    cat_label?: string | null
  }

  export type categorieUpdateManyMutationInput = {
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type categorieUncheckedUpdateManyInput = {
    cat_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type categorie_attribut_cenov_dev_ewanCreateInput = {
    attribut: attribut_cenov_dev_ewanCreateNestedOneWithoutCategorie_attributInput
    categorie: categorieCreateNestedOneWithoutCategorie_attributInput
  }

  export type categorie_attribut_cenov_dev_ewanUncheckedCreateInput = {
    fk_categorie: number
    fk_attribute: number
  }

  export type categorie_attribut_cenov_dev_ewanUpdateInput = {
    attribut?: attribut_cenov_dev_ewanUpdateOneRequiredWithoutCategorie_attributNestedInput
    categorie?: categorieUpdateOneRequiredWithoutCategorie_attributNestedInput
  }

  export type categorie_attribut_cenov_dev_ewanUncheckedUpdateInput = {
    fk_categorie?: IntFieldUpdateOperationsInput | number
    fk_attribute?: IntFieldUpdateOperationsInput | number
  }

  export type categorie_attribut_cenov_dev_ewanCreateManyInput = {
    fk_categorie: number
    fk_attribute: number
  }

  export type categorie_attribut_cenov_dev_ewanUpdateManyMutationInput = {

  }

  export type categorie_attribut_cenov_dev_ewanUncheckedUpdateManyInput = {
    fk_categorie?: IntFieldUpdateOperationsInput | number
    fk_attribute?: IntFieldUpdateOperationsInput | number
  }

  export type cross_refCreateInput = {
    crf_id: number
    produit: produitCreateNestedOneWithoutCross_refInput
  }

  export type cross_refUncheckedCreateInput = {
    crf_id: number
    fk_produit: number
  }

  export type cross_refUpdateInput = {
    crf_id?: IntFieldUpdateOperationsInput | number
    produit?: produitUpdateOneRequiredWithoutCross_refNestedInput
  }

  export type cross_refUncheckedUpdateInput = {
    crf_id?: IntFieldUpdateOperationsInput | number
    fk_produit?: IntFieldUpdateOperationsInput | number
  }

  export type cross_refCreateManyInput = {
    crf_id: number
    fk_produit: number
  }

  export type cross_refUpdateManyMutationInput = {
    crf_id?: IntFieldUpdateOperationsInput | number
  }

  export type cross_refUncheckedUpdateManyInput = {
    crf_id?: IntFieldUpdateOperationsInput | number
    fk_produit?: IntFieldUpdateOperationsInput | number
  }

  export type familleCreateInput = {
    fam_code?: string | null
    fam_label?: string | null
    fournisseur: fournisseurCreateNestedOneWithoutFamilleInput
    famille?: familleCreateNestedOneWithoutOther_familleInput
    other_famille?: familleCreateNestedManyWithoutFamilleInput
  }

  export type familleUncheckedCreateInput = {
    fam_id?: number
    fk_parent?: number | null
    fam_code?: string | null
    fam_label?: string | null
    fk_supplier: number
    other_famille?: familleUncheckedCreateNestedManyWithoutFamilleInput
  }

  export type familleUpdateInput = {
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    fournisseur?: fournisseurUpdateOneRequiredWithoutFamilleNestedInput
    famille?: familleUpdateOneWithoutOther_familleNestedInput
    other_famille?: familleUpdateManyWithoutFamilleNestedInput
  }

  export type familleUncheckedUpdateInput = {
    fam_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: IntFieldUpdateOperationsInput | number
    other_famille?: familleUncheckedUpdateManyWithoutFamilleNestedInput
  }

  export type familleCreateManyInput = {
    fam_id?: number
    fk_parent?: number | null
    fam_code?: string | null
    fam_label?: string | null
    fk_supplier: number
  }

  export type familleUpdateManyMutationInput = {
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type familleUncheckedUpdateManyInput = {
    fam_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: IntFieldUpdateOperationsInput | number
  }

  export type produitCreateInput = {
    pro_code?: string | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    cross_ref?: cross_refCreateNestedManyWithoutProduitInput
    kit?: kit_cenov_dev_ewanCreateNestedOneWithoutProduitInput
    fournisseur?: fournisseurCreateNestedOneWithoutProduitInput
    produit_categorie?: produit_categorie_cenov_dev_ewanCreateNestedManyWithoutProduitInput
    tarif_achat?: tarif_achat_cenov_dev_ewanCreateNestedManyWithoutProduitInput
  }

  export type produitUncheckedCreateInput = {
    pro_id?: number
    pro_code?: string | null
    fk_supplier?: number | null
    fk_kit?: number | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    cross_ref?: cross_refUncheckedCreateNestedManyWithoutProduitInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedCreateNestedManyWithoutProduitInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUncheckedCreateNestedManyWithoutProduitInput
  }

  export type produitUpdateInput = {
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cross_ref?: cross_refUpdateManyWithoutProduitNestedInput
    kit?: kit_cenov_dev_ewanUpdateOneWithoutProduitNestedInput
    fournisseur?: fournisseurUpdateOneWithoutProduitNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUpdateManyWithoutProduitNestedInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUpdateManyWithoutProduitNestedInput
  }

  export type produitUncheckedUpdateInput = {
    pro_id?: IntFieldUpdateOperationsInput | number
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: NullableIntFieldUpdateOperationsInput | number | null
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cross_ref?: cross_refUncheckedUpdateManyWithoutProduitNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutProduitNestedInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUncheckedUpdateManyWithoutProduitNestedInput
  }

  export type produitCreateManyInput = {
    pro_id?: number
    pro_code?: string | null
    fk_supplier?: number | null
    fk_kit?: number | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type produitUpdateManyMutationInput = {
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type produitUncheckedUpdateManyInput = {
    pro_id?: IntFieldUpdateOperationsInput | number
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: NullableIntFieldUpdateOperationsInput | number | null
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type produit_categorie_cenov_dev_ewanCreateInput = {
    categorie: categorieCreateNestedOneWithoutProduit_categorieInput
    produit: produitCreateNestedOneWithoutProduit_categorieInput
  }

  export type produit_categorie_cenov_dev_ewanUncheckedCreateInput = {
    fk_produit: number
    fk_categorie: number
  }

  export type produit_categorie_cenov_dev_ewanUpdateInput = {
    categorie?: categorieUpdateOneRequiredWithoutProduit_categorieNestedInput
    produit?: produitUpdateOneRequiredWithoutProduit_categorieNestedInput
  }

  export type produit_categorie_cenov_dev_ewanUncheckedUpdateInput = {
    fk_produit?: IntFieldUpdateOperationsInput | number
    fk_categorie?: IntFieldUpdateOperationsInput | number
  }

  export type produit_categorie_cenov_dev_ewanCreateManyInput = {
    fk_produit: number
    fk_categorie: number
  }

  export type produit_categorie_cenov_dev_ewanUpdateManyMutationInput = {

  }

  export type produit_categorie_cenov_dev_ewanUncheckedUpdateManyInput = {
    fk_produit?: IntFieldUpdateOperationsInput | number
    fk_categorie?: IntFieldUpdateOperationsInput | number
  }

  export type tarif_achat_cenov_dev_ewanCreateInput = {
    taa_date: Date | string
    taa_montant?: number | null
    taa_remise?: number | null
    taa_montant_net?: number | null
    produit: produitCreateNestedOneWithoutTarif_achatInput
  }

  export type tarif_achat_cenov_dev_ewanUncheckedCreateInput = {
    fk_produit: number
    taa_date: Date | string
    taa_montant?: number | null
    taa_remise?: number | null
    taa_montant_net?: number | null
  }

  export type tarif_achat_cenov_dev_ewanUpdateInput = {
    taa_date?: DateTimeFieldUpdateOperationsInput | Date | string
    taa_montant?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_remise?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_montant_net?: NullableFloatFieldUpdateOperationsInput | number | null
    produit?: produitUpdateOneRequiredWithoutTarif_achatNestedInput
  }

  export type tarif_achat_cenov_dev_ewanUncheckedUpdateInput = {
    fk_produit?: IntFieldUpdateOperationsInput | number
    taa_date?: DateTimeFieldUpdateOperationsInput | Date | string
    taa_montant?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_remise?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_montant_net?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type tarif_achat_cenov_dev_ewanCreateManyInput = {
    fk_produit: number
    taa_date: Date | string
    taa_montant?: number | null
    taa_remise?: number | null
    taa_montant_net?: number | null
  }

  export type tarif_achat_cenov_dev_ewanUpdateManyMutationInput = {
    taa_date?: DateTimeFieldUpdateOperationsInput | Date | string
    taa_montant?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_remise?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_montant_net?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type tarif_achat_cenov_dev_ewanUncheckedUpdateManyInput = {
    fk_produit?: IntFieldUpdateOperationsInput | number
    taa_date?: DateTimeFieldUpdateOperationsInput | Date | string
    taa_montant?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_remise?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_montant_net?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type attribut_cenov_dev_ewanCreateInput = {
    atr_nat?: string | null
    atr_val?: string | null
    atr_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanCreateNestedManyWithoutAttributInput
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput
  }

  export type attribut_cenov_dev_ewanUncheckedCreateInput = {
    atr_id?: number
    atr_nat?: string | null
    atr_val?: string | null
    atr_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedCreateNestedManyWithoutAttributInput
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanUncheckedCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanUncheckedCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput
  }

  export type attribut_cenov_dev_ewanUpdateInput = {
    atr_nat?: NullableStringFieldUpdateOperationsInput | string | null
    atr_val?: NullableStringFieldUpdateOperationsInput | string | null
    atr_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUpdateManyWithoutAttributNestedInput
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanUpdateManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributNestedInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanUpdateManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributNestedInput
  }

  export type attribut_cenov_dev_ewanUncheckedUpdateInput = {
    atr_id?: IntFieldUpdateOperationsInput | number
    atr_nat?: NullableStringFieldUpdateOperationsInput | string | null
    atr_val?: NullableStringFieldUpdateOperationsInput | string | null
    atr_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutAttributNestedInput
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributNestedInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributNestedInput
  }

  export type attribut_cenov_dev_ewanCreateManyInput = {
    atr_id?: number
    atr_nat?: string | null
    atr_val?: string | null
    atr_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type attribut_cenov_dev_ewanUpdateManyMutationInput = {
    atr_nat?: NullableStringFieldUpdateOperationsInput | string | null
    atr_val?: NullableStringFieldUpdateOperationsInput | string | null
    atr_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type attribut_cenov_dev_ewanUncheckedUpdateManyInput = {
    atr_id?: IntFieldUpdateOperationsInput | number
    atr_nat?: NullableStringFieldUpdateOperationsInput | string | null
    atr_val?: NullableStringFieldUpdateOperationsInput | string | null
    atr_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type fournisseurCreateInput = {
    frs_code: string
    frs_label?: string | null
    famille?: familleCreateNestedManyWithoutFournisseurInput
    produit?: produitCreateNestedManyWithoutFournisseurInput
  }

  export type fournisseurUncheckedCreateInput = {
    frs_id?: number
    frs_code: string
    frs_label?: string | null
    famille?: familleUncheckedCreateNestedManyWithoutFournisseurInput
    produit?: produitUncheckedCreateNestedManyWithoutFournisseurInput
  }

  export type fournisseurUpdateInput = {
    frs_code?: StringFieldUpdateOperationsInput | string
    frs_label?: NullableStringFieldUpdateOperationsInput | string | null
    famille?: familleUpdateManyWithoutFournisseurNestedInput
    produit?: produitUpdateManyWithoutFournisseurNestedInput
  }

  export type fournisseurUncheckedUpdateInput = {
    frs_id?: IntFieldUpdateOperationsInput | number
    frs_code?: StringFieldUpdateOperationsInput | string
    frs_label?: NullableStringFieldUpdateOperationsInput | string | null
    famille?: familleUncheckedUpdateManyWithoutFournisseurNestedInput
    produit?: produitUncheckedUpdateManyWithoutFournisseurNestedInput
  }

  export type fournisseurCreateManyInput = {
    frs_id?: number
    frs_code: string
    frs_label?: string | null
  }

  export type fournisseurUpdateManyMutationInput = {
    frs_code?: StringFieldUpdateOperationsInput | string
    frs_label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type fournisseurUncheckedUpdateManyInput = {
    frs_id?: IntFieldUpdateOperationsInput | number
    frs_code?: StringFieldUpdateOperationsInput | string
    frs_label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type kit_cenov_dev_ewanCreateInput = {
    kit_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    produit?: produitCreateNestedManyWithoutKitInput
    kit_attribute?: kit_attribute_cenov_dev_ewanCreateNestedManyWithoutKitInput
    part_nc?: part_nc_cenov_dev_ewanCreateNestedManyWithoutKitInput
  }

  export type kit_cenov_dev_ewanUncheckedCreateInput = {
    kit_id?: number
    kit_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    produit?: produitUncheckedCreateNestedManyWithoutKitInput
    kit_attribute?: kit_attribute_cenov_dev_ewanUncheckedCreateNestedManyWithoutKitInput
    part_nc?: part_nc_cenov_dev_ewanUncheckedCreateNestedManyWithoutKitInput
  }

  export type kit_cenov_dev_ewanUpdateInput = {
    kit_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    produit?: produitUpdateManyWithoutKitNestedInput
    kit_attribute?: kit_attribute_cenov_dev_ewanUpdateManyWithoutKitNestedInput
    part_nc?: part_nc_cenov_dev_ewanUpdateManyWithoutKitNestedInput
  }

  export type kit_cenov_dev_ewanUncheckedUpdateInput = {
    kit_id?: IntFieldUpdateOperationsInput | number
    kit_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    produit?: produitUncheckedUpdateManyWithoutKitNestedInput
    kit_attribute?: kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutKitNestedInput
    part_nc?: part_nc_cenov_dev_ewanUncheckedUpdateManyWithoutKitNestedInput
  }

  export type kit_cenov_dev_ewanCreateManyInput = {
    kit_id?: number
    kit_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type kit_cenov_dev_ewanUpdateManyMutationInput = {
    kit_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type kit_cenov_dev_ewanUncheckedUpdateManyInput = {
    kit_id?: IntFieldUpdateOperationsInput | number
    kit_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type kit_attribute_cenov_dev_ewanCreateInput = {
    kat_valeur?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attribut_kit_attribute_fk_attribute_caracToattribut?: attribut_cenov_dev_ewanCreateNestedOneWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput
    attribut_kit_attribute_fk_attribute_unitToattribut?: attribut_cenov_dev_ewanCreateNestedOneWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput
    kit?: kit_cenov_dev_ewanCreateNestedOneWithoutKit_attributeInput
  }

  export type kit_attribute_cenov_dev_ewanUncheckedCreateInput = {
    fk_kit?: number | null
    fk_attribute_carac?: number | null
    fk_attribute_unit?: number | null
    kat_valeur?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kat_id?: number
  }

  export type kit_attribute_cenov_dev_ewanUpdateInput = {
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attribut_kit_attribute_fk_attribute_caracToattribut?: attribut_cenov_dev_ewanUpdateOneWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributNestedInput
    attribut_kit_attribute_fk_attribute_unitToattribut?: attribut_cenov_dev_ewanUpdateOneWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributNestedInput
    kit?: kit_cenov_dev_ewanUpdateOneWithoutKit_attributeNestedInput
  }

  export type kit_attribute_cenov_dev_ewanUncheckedUpdateInput = {
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_attribute_carac?: NullableIntFieldUpdateOperationsInput | number | null
    fk_attribute_unit?: NullableIntFieldUpdateOperationsInput | number | null
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kat_id?: IntFieldUpdateOperationsInput | number
  }

  export type kit_attribute_cenov_dev_ewanCreateManyInput = {
    fk_kit?: number | null
    fk_attribute_carac?: number | null
    fk_attribute_unit?: number | null
    kat_valeur?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kat_id?: number
  }

  export type kit_attribute_cenov_dev_ewanUpdateManyMutationInput = {
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type kit_attribute_cenov_dev_ewanUncheckedUpdateManyInput = {
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_attribute_carac?: NullableIntFieldUpdateOperationsInput | number | null
    fk_attribute_unit?: NullableIntFieldUpdateOperationsInput | number | null
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kat_id?: IntFieldUpdateOperationsInput | number
  }

  export type part_nc_cenov_dev_ewanCreateInput = {
    par_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kit?: kit_cenov_dev_ewanCreateNestedOneWithoutPart_ncInput
  }

  export type part_nc_cenov_dev_ewanUncheckedCreateInput = {
    par_id?: number
    fk_kit?: number | null
    par_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type part_nc_cenov_dev_ewanUpdateInput = {
    par_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kit?: kit_cenov_dev_ewanUpdateOneWithoutPart_ncNestedInput
  }

  export type part_nc_cenov_dev_ewanUncheckedUpdateInput = {
    par_id?: IntFieldUpdateOperationsInput | number
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    par_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type part_nc_cenov_dev_ewanCreateManyInput = {
    par_id?: number
    fk_kit?: number | null
    par_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type part_nc_cenov_dev_ewanUpdateManyMutationInput = {
    par_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type part_nc_cenov_dev_ewanUncheckedUpdateManyInput = {
    par_id?: IntFieldUpdateOperationsInput | number
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    par_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type famille_ewanCreateInput = {
    fam_id: number
    fk_parent?: number | null
    fam_code?: string | null
    fam_label?: string | null
    fk_supplier?: number | null
  }

  export type famille_ewanUncheckedCreateInput = {
    fam_id: number
    fk_parent?: number | null
    fam_code?: string | null
    fam_label?: string | null
    fk_supplier?: number | null
  }

  export type famille_ewanUpdateInput = {
    fam_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type famille_ewanUncheckedUpdateInput = {
    fam_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type famille_ewanCreateManyInput = {
    fam_id: number
    fk_parent?: number | null
    fam_code?: string | null
    fam_label?: string | null
    fk_supplier?: number | null
  }

  export type famille_ewanUpdateManyMutationInput = {
    fam_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type famille_ewanUncheckedUpdateManyInput = {
    fam_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type CategorieNullableScalarRelationFilter = {
    is?: categorieWhereInput | null
    isNot?: categorieWhereInput | null
  }

  export type CategorieListRelationFilter = {
    every?: categorieWhereInput
    some?: categorieWhereInput
    none?: categorieWhereInput
  }

  export type Categorie_attribut_cenov_dev_ewanListRelationFilter = {
    every?: categorie_attribut_cenov_dev_ewanWhereInput
    some?: categorie_attribut_cenov_dev_ewanWhereInput
    none?: categorie_attribut_cenov_dev_ewanWhereInput
  }

  export type Produit_categorie_cenov_dev_ewanListRelationFilter = {
    every?: produit_categorie_cenov_dev_ewanWhereInput
    some?: produit_categorie_cenov_dev_ewanWhereInput
    none?: produit_categorie_cenov_dev_ewanWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type categorieOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type categorie_attribut_cenov_dev_ewanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type produit_categorie_cenov_dev_ewanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type categorieFk_parentCat_codeCompoundUniqueInput = {
    fk_parent: number
    cat_code: string
  }

  export type categorieCountOrderByAggregateInput = {
    cat_id?: SortOrder
    fk_parent?: SortOrder
    cat_code?: SortOrder
    cat_label?: SortOrder
  }

  export type categorieAvgOrderByAggregateInput = {
    cat_id?: SortOrder
    fk_parent?: SortOrder
  }

  export type categorieMaxOrderByAggregateInput = {
    cat_id?: SortOrder
    fk_parent?: SortOrder
    cat_code?: SortOrder
    cat_label?: SortOrder
  }

  export type categorieMinOrderByAggregateInput = {
    cat_id?: SortOrder
    fk_parent?: SortOrder
    cat_code?: SortOrder
    cat_label?: SortOrder
  }

  export type categorieSumOrderByAggregateInput = {
    cat_id?: SortOrder
    fk_parent?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type Attribut_cenov_dev_ewanScalarRelationFilter = {
    is?: attribut_cenov_dev_ewanWhereInput
    isNot?: attribut_cenov_dev_ewanWhereInput
  }

  export type CategorieScalarRelationFilter = {
    is?: categorieWhereInput
    isNot?: categorieWhereInput
  }

  export type categorie_attribut_cenov_dev_ewanFk_categorieFk_attributeCompoundUniqueInput = {
    fk_categorie: number
    fk_attribute: number
  }

  export type categorie_attribut_cenov_dev_ewanCountOrderByAggregateInput = {
    fk_categorie?: SortOrder
    fk_attribute?: SortOrder
  }

  export type categorie_attribut_cenov_dev_ewanAvgOrderByAggregateInput = {
    fk_categorie?: SortOrder
    fk_attribute?: SortOrder
  }

  export type categorie_attribut_cenov_dev_ewanMaxOrderByAggregateInput = {
    fk_categorie?: SortOrder
    fk_attribute?: SortOrder
  }

  export type categorie_attribut_cenov_dev_ewanMinOrderByAggregateInput = {
    fk_categorie?: SortOrder
    fk_attribute?: SortOrder
  }

  export type categorie_attribut_cenov_dev_ewanSumOrderByAggregateInput = {
    fk_categorie?: SortOrder
    fk_attribute?: SortOrder
  }

  export type ProduitScalarRelationFilter = {
    is?: produitWhereInput
    isNot?: produitWhereInput
  }

  export type cross_refCrf_idFk_produitCompoundUniqueInput = {
    crf_id: number
    fk_produit: number
  }

  export type cross_refCountOrderByAggregateInput = {
    crf_id?: SortOrder
    fk_produit?: SortOrder
  }

  export type cross_refAvgOrderByAggregateInput = {
    crf_id?: SortOrder
    fk_produit?: SortOrder
  }

  export type cross_refMaxOrderByAggregateInput = {
    crf_id?: SortOrder
    fk_produit?: SortOrder
  }

  export type cross_refMinOrderByAggregateInput = {
    crf_id?: SortOrder
    fk_produit?: SortOrder
  }

  export type cross_refSumOrderByAggregateInput = {
    crf_id?: SortOrder
    fk_produit?: SortOrder
  }

  export type FournisseurScalarRelationFilter = {
    is?: fournisseurWhereInput
    isNot?: fournisseurWhereInput
  }

  export type FamilleNullableScalarRelationFilter = {
    is?: familleWhereInput | null
    isNot?: familleWhereInput | null
  }

  export type FamilleListRelationFilter = {
    every?: familleWhereInput
    some?: familleWhereInput
    none?: familleWhereInput
  }

  export type familleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type familleFk_parentFam_codeCompoundUniqueInput = {
    fk_parent: number
    fam_code: string
  }

  export type familleCountOrderByAggregateInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrder
    fam_code?: SortOrder
    fam_label?: SortOrder
    fk_supplier?: SortOrder
  }

  export type familleAvgOrderByAggregateInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrder
    fk_supplier?: SortOrder
  }

  export type familleMaxOrderByAggregateInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrder
    fam_code?: SortOrder
    fam_label?: SortOrder
    fk_supplier?: SortOrder
  }

  export type familleMinOrderByAggregateInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrder
    fam_code?: SortOrder
    fam_label?: SortOrder
    fk_supplier?: SortOrder
  }

  export type familleSumOrderByAggregateInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrder
    fk_supplier?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type Cross_refListRelationFilter = {
    every?: cross_refWhereInput
    some?: cross_refWhereInput
    none?: cross_refWhereInput
  }

  export type Kit_cenov_dev_ewanNullableScalarRelationFilter = {
    is?: kit_cenov_dev_ewanWhereInput | null
    isNot?: kit_cenov_dev_ewanWhereInput | null
  }

  export type FournisseurNullableScalarRelationFilter = {
    is?: fournisseurWhereInput | null
    isNot?: fournisseurWhereInput | null
  }

  export type Tarif_achat_cenov_dev_ewanListRelationFilter = {
    every?: tarif_achat_cenov_dev_ewanWhereInput
    some?: tarif_achat_cenov_dev_ewanWhereInput
    none?: tarif_achat_cenov_dev_ewanWhereInput
  }

  export type cross_refOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type tarif_achat_cenov_dev_ewanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type produitCountOrderByAggregateInput = {
    pro_id?: SortOrder
    pro_code?: SortOrder
    fk_supplier?: SortOrder
    fk_kit?: SortOrder
    fk_famille?: SortOrder
    fk_sfamille?: SortOrder
    fk_ssfamille?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type produitAvgOrderByAggregateInput = {
    pro_id?: SortOrder
    fk_supplier?: SortOrder
    fk_kit?: SortOrder
    fk_famille?: SortOrder
    fk_sfamille?: SortOrder
    fk_ssfamille?: SortOrder
  }

  export type produitMaxOrderByAggregateInput = {
    pro_id?: SortOrder
    pro_code?: SortOrder
    fk_supplier?: SortOrder
    fk_kit?: SortOrder
    fk_famille?: SortOrder
    fk_sfamille?: SortOrder
    fk_ssfamille?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type produitMinOrderByAggregateInput = {
    pro_id?: SortOrder
    pro_code?: SortOrder
    fk_supplier?: SortOrder
    fk_kit?: SortOrder
    fk_famille?: SortOrder
    fk_sfamille?: SortOrder
    fk_ssfamille?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type produitSumOrderByAggregateInput = {
    pro_id?: SortOrder
    fk_supplier?: SortOrder
    fk_kit?: SortOrder
    fk_famille?: SortOrder
    fk_sfamille?: SortOrder
    fk_ssfamille?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type produit_categorie_cenov_dev_ewanFk_produitFk_categorieCompoundUniqueInput = {
    fk_produit: number
    fk_categorie: number
  }

  export type produit_categorie_cenov_dev_ewanCountOrderByAggregateInput = {
    fk_produit?: SortOrder
    fk_categorie?: SortOrder
  }

  export type produit_categorie_cenov_dev_ewanAvgOrderByAggregateInput = {
    fk_produit?: SortOrder
    fk_categorie?: SortOrder
  }

  export type produit_categorie_cenov_dev_ewanMaxOrderByAggregateInput = {
    fk_produit?: SortOrder
    fk_categorie?: SortOrder
  }

  export type produit_categorie_cenov_dev_ewanMinOrderByAggregateInput = {
    fk_produit?: SortOrder
    fk_categorie?: SortOrder
  }

  export type produit_categorie_cenov_dev_ewanSumOrderByAggregateInput = {
    fk_produit?: SortOrder
    fk_categorie?: SortOrder
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type tarif_achat_cenov_dev_ewanFk_produitTaa_dateCompoundUniqueInput = {
    fk_produit: number
    taa_date: Date | string
  }

  export type tarif_achat_cenov_dev_ewanCountOrderByAggregateInput = {
    fk_produit?: SortOrder
    taa_date?: SortOrder
    taa_montant?: SortOrder
    taa_remise?: SortOrder
    taa_montant_net?: SortOrder
  }

  export type tarif_achat_cenov_dev_ewanAvgOrderByAggregateInput = {
    fk_produit?: SortOrder
    taa_montant?: SortOrder
    taa_remise?: SortOrder
    taa_montant_net?: SortOrder
  }

  export type tarif_achat_cenov_dev_ewanMaxOrderByAggregateInput = {
    fk_produit?: SortOrder
    taa_date?: SortOrder
    taa_montant?: SortOrder
    taa_remise?: SortOrder
    taa_montant_net?: SortOrder
  }

  export type tarif_achat_cenov_dev_ewanMinOrderByAggregateInput = {
    fk_produit?: SortOrder
    taa_date?: SortOrder
    taa_montant?: SortOrder
    taa_remise?: SortOrder
    taa_montant_net?: SortOrder
  }

  export type tarif_achat_cenov_dev_ewanSumOrderByAggregateInput = {
    fk_produit?: SortOrder
    taa_montant?: SortOrder
    taa_remise?: SortOrder
    taa_montant_net?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type Kit_attribute_cenov_dev_ewanListRelationFilter = {
    every?: kit_attribute_cenov_dev_ewanWhereInput
    some?: kit_attribute_cenov_dev_ewanWhereInput
    none?: kit_attribute_cenov_dev_ewanWhereInput
  }

  export type kit_attribute_cenov_dev_ewanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type attribut_cenov_dev_ewanAtr_natAtr_valCompoundUniqueInput = {
    atr_nat: string
    atr_val: string
  }

  export type attribut_cenov_dev_ewanCountOrderByAggregateInput = {
    atr_id?: SortOrder
    atr_nat?: SortOrder
    atr_val?: SortOrder
    atr_label?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type attribut_cenov_dev_ewanAvgOrderByAggregateInput = {
    atr_id?: SortOrder
  }

  export type attribut_cenov_dev_ewanMaxOrderByAggregateInput = {
    atr_id?: SortOrder
    atr_nat?: SortOrder
    atr_val?: SortOrder
    atr_label?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type attribut_cenov_dev_ewanMinOrderByAggregateInput = {
    atr_id?: SortOrder
    atr_nat?: SortOrder
    atr_val?: SortOrder
    atr_label?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type attribut_cenov_dev_ewanSumOrderByAggregateInput = {
    atr_id?: SortOrder
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type ProduitListRelationFilter = {
    every?: produitWhereInput
    some?: produitWhereInput
    none?: produitWhereInput
  }

  export type produitOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type fournisseurCountOrderByAggregateInput = {
    frs_id?: SortOrder
    frs_code?: SortOrder
    frs_label?: SortOrder
  }

  export type fournisseurAvgOrderByAggregateInput = {
    frs_id?: SortOrder
  }

  export type fournisseurMaxOrderByAggregateInput = {
    frs_id?: SortOrder
    frs_code?: SortOrder
    frs_label?: SortOrder
  }

  export type fournisseurMinOrderByAggregateInput = {
    frs_id?: SortOrder
    frs_code?: SortOrder
    frs_label?: SortOrder
  }

  export type fournisseurSumOrderByAggregateInput = {
    frs_id?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type Part_nc_cenov_dev_ewanListRelationFilter = {
    every?: part_nc_cenov_dev_ewanWhereInput
    some?: part_nc_cenov_dev_ewanWhereInput
    none?: part_nc_cenov_dev_ewanWhereInput
  }

  export type part_nc_cenov_dev_ewanOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type kit_cenov_dev_ewanCountOrderByAggregateInput = {
    kit_id?: SortOrder
    kit_label?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type kit_cenov_dev_ewanAvgOrderByAggregateInput = {
    kit_id?: SortOrder
  }

  export type kit_cenov_dev_ewanMaxOrderByAggregateInput = {
    kit_id?: SortOrder
    kit_label?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type kit_cenov_dev_ewanMinOrderByAggregateInput = {
    kit_id?: SortOrder
    kit_label?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type kit_cenov_dev_ewanSumOrderByAggregateInput = {
    kit_id?: SortOrder
  }

  export type Attribut_cenov_dev_ewanNullableScalarRelationFilter = {
    is?: attribut_cenov_dev_ewanWhereInput | null
    isNot?: attribut_cenov_dev_ewanWhereInput | null
  }

  export type kit_attribute_cenov_dev_ewanCountOrderByAggregateInput = {
    fk_kit?: SortOrder
    fk_attribute_carac?: SortOrder
    fk_attribute_unit?: SortOrder
    kat_valeur?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    kat_id?: SortOrder
  }

  export type kit_attribute_cenov_dev_ewanAvgOrderByAggregateInput = {
    fk_kit?: SortOrder
    fk_attribute_carac?: SortOrder
    fk_attribute_unit?: SortOrder
    kat_id?: SortOrder
  }

  export type kit_attribute_cenov_dev_ewanMaxOrderByAggregateInput = {
    fk_kit?: SortOrder
    fk_attribute_carac?: SortOrder
    fk_attribute_unit?: SortOrder
    kat_valeur?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    kat_id?: SortOrder
  }

  export type kit_attribute_cenov_dev_ewanMinOrderByAggregateInput = {
    fk_kit?: SortOrder
    fk_attribute_carac?: SortOrder
    fk_attribute_unit?: SortOrder
    kat_valeur?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    kat_id?: SortOrder
  }

  export type kit_attribute_cenov_dev_ewanSumOrderByAggregateInput = {
    fk_kit?: SortOrder
    fk_attribute_carac?: SortOrder
    fk_attribute_unit?: SortOrder
    kat_id?: SortOrder
  }

  export type part_nc_cenov_dev_ewanCountOrderByAggregateInput = {
    par_id?: SortOrder
    fk_kit?: SortOrder
    par_label?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type part_nc_cenov_dev_ewanAvgOrderByAggregateInput = {
    par_id?: SortOrder
    fk_kit?: SortOrder
  }

  export type part_nc_cenov_dev_ewanMaxOrderByAggregateInput = {
    par_id?: SortOrder
    fk_kit?: SortOrder
    par_label?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type part_nc_cenov_dev_ewanMinOrderByAggregateInput = {
    par_id?: SortOrder
    fk_kit?: SortOrder
    par_label?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type part_nc_cenov_dev_ewanSumOrderByAggregateInput = {
    par_id?: SortOrder
    fk_kit?: SortOrder
  }

  export type famille_ewanCountOrderByAggregateInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrder
    fam_code?: SortOrder
    fam_label?: SortOrder
    fk_supplier?: SortOrder
  }

  export type famille_ewanAvgOrderByAggregateInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrder
    fk_supplier?: SortOrder
  }

  export type famille_ewanMaxOrderByAggregateInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrder
    fam_code?: SortOrder
    fam_label?: SortOrder
    fk_supplier?: SortOrder
  }

  export type famille_ewanMinOrderByAggregateInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrder
    fam_code?: SortOrder
    fam_label?: SortOrder
    fk_supplier?: SortOrder
  }

  export type famille_ewanSumOrderByAggregateInput = {
    fam_id?: SortOrder
    fk_parent?: SortOrder
    fk_supplier?: SortOrder
  }

  export type categorieCreateNestedOneWithoutOther_categorieInput = {
    create?: XOR<categorieCreateWithoutOther_categorieInput, categorieUncheckedCreateWithoutOther_categorieInput>
    connectOrCreate?: categorieCreateOrConnectWithoutOther_categorieInput
    connect?: categorieWhereUniqueInput
  }

  export type categorieCreateNestedManyWithoutCategorieInput = {
    create?: XOR<categorieCreateWithoutCategorieInput, categorieUncheckedCreateWithoutCategorieInput> | categorieCreateWithoutCategorieInput[] | categorieUncheckedCreateWithoutCategorieInput[]
    connectOrCreate?: categorieCreateOrConnectWithoutCategorieInput | categorieCreateOrConnectWithoutCategorieInput[]
    createMany?: categorieCreateManyCategorieInputEnvelope
    connect?: categorieWhereUniqueInput | categorieWhereUniqueInput[]
  }

  export type categorie_attribut_cenov_dev_ewanCreateNestedManyWithoutCategorieInput = {
    create?: XOR<categorie_attribut_cenov_dev_ewanCreateWithoutCategorieInput, categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutCategorieInput> | categorie_attribut_cenov_dev_ewanCreateWithoutCategorieInput[] | categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutCategorieInput[]
    connectOrCreate?: categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutCategorieInput | categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutCategorieInput[]
    createMany?: categorie_attribut_cenov_dev_ewanCreateManyCategorieInputEnvelope
    connect?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
  }

  export type produit_categorie_cenov_dev_ewanCreateNestedManyWithoutCategorieInput = {
    create?: XOR<produit_categorie_cenov_dev_ewanCreateWithoutCategorieInput, produit_categorie_cenov_dev_ewanUncheckedCreateWithoutCategorieInput> | produit_categorie_cenov_dev_ewanCreateWithoutCategorieInput[] | produit_categorie_cenov_dev_ewanUncheckedCreateWithoutCategorieInput[]
    connectOrCreate?: produit_categorie_cenov_dev_ewanCreateOrConnectWithoutCategorieInput | produit_categorie_cenov_dev_ewanCreateOrConnectWithoutCategorieInput[]
    createMany?: produit_categorie_cenov_dev_ewanCreateManyCategorieInputEnvelope
    connect?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
  }

  export type categorieUncheckedCreateNestedManyWithoutCategorieInput = {
    create?: XOR<categorieCreateWithoutCategorieInput, categorieUncheckedCreateWithoutCategorieInput> | categorieCreateWithoutCategorieInput[] | categorieUncheckedCreateWithoutCategorieInput[]
    connectOrCreate?: categorieCreateOrConnectWithoutCategorieInput | categorieCreateOrConnectWithoutCategorieInput[]
    createMany?: categorieCreateManyCategorieInputEnvelope
    connect?: categorieWhereUniqueInput | categorieWhereUniqueInput[]
  }

  export type categorie_attribut_cenov_dev_ewanUncheckedCreateNestedManyWithoutCategorieInput = {
    create?: XOR<categorie_attribut_cenov_dev_ewanCreateWithoutCategorieInput, categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutCategorieInput> | categorie_attribut_cenov_dev_ewanCreateWithoutCategorieInput[] | categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutCategorieInput[]
    connectOrCreate?: categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutCategorieInput | categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutCategorieInput[]
    createMany?: categorie_attribut_cenov_dev_ewanCreateManyCategorieInputEnvelope
    connect?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
  }

  export type produit_categorie_cenov_dev_ewanUncheckedCreateNestedManyWithoutCategorieInput = {
    create?: XOR<produit_categorie_cenov_dev_ewanCreateWithoutCategorieInput, produit_categorie_cenov_dev_ewanUncheckedCreateWithoutCategorieInput> | produit_categorie_cenov_dev_ewanCreateWithoutCategorieInput[] | produit_categorie_cenov_dev_ewanUncheckedCreateWithoutCategorieInput[]
    connectOrCreate?: produit_categorie_cenov_dev_ewanCreateOrConnectWithoutCategorieInput | produit_categorie_cenov_dev_ewanCreateOrConnectWithoutCategorieInput[]
    createMany?: produit_categorie_cenov_dev_ewanCreateManyCategorieInputEnvelope
    connect?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type categorieUpdateOneWithoutOther_categorieNestedInput = {
    create?: XOR<categorieCreateWithoutOther_categorieInput, categorieUncheckedCreateWithoutOther_categorieInput>
    connectOrCreate?: categorieCreateOrConnectWithoutOther_categorieInput
    upsert?: categorieUpsertWithoutOther_categorieInput
    disconnect?: categorieWhereInput | boolean
    delete?: categorieWhereInput | boolean
    connect?: categorieWhereUniqueInput
    update?: XOR<XOR<categorieUpdateToOneWithWhereWithoutOther_categorieInput, categorieUpdateWithoutOther_categorieInput>, categorieUncheckedUpdateWithoutOther_categorieInput>
  }

  export type categorieUpdateManyWithoutCategorieNestedInput = {
    create?: XOR<categorieCreateWithoutCategorieInput, categorieUncheckedCreateWithoutCategorieInput> | categorieCreateWithoutCategorieInput[] | categorieUncheckedCreateWithoutCategorieInput[]
    connectOrCreate?: categorieCreateOrConnectWithoutCategorieInput | categorieCreateOrConnectWithoutCategorieInput[]
    upsert?: categorieUpsertWithWhereUniqueWithoutCategorieInput | categorieUpsertWithWhereUniqueWithoutCategorieInput[]
    createMany?: categorieCreateManyCategorieInputEnvelope
    set?: categorieWhereUniqueInput | categorieWhereUniqueInput[]
    disconnect?: categorieWhereUniqueInput | categorieWhereUniqueInput[]
    delete?: categorieWhereUniqueInput | categorieWhereUniqueInput[]
    connect?: categorieWhereUniqueInput | categorieWhereUniqueInput[]
    update?: categorieUpdateWithWhereUniqueWithoutCategorieInput | categorieUpdateWithWhereUniqueWithoutCategorieInput[]
    updateMany?: categorieUpdateManyWithWhereWithoutCategorieInput | categorieUpdateManyWithWhereWithoutCategorieInput[]
    deleteMany?: categorieScalarWhereInput | categorieScalarWhereInput[]
  }

  export type categorie_attribut_cenov_dev_ewanUpdateManyWithoutCategorieNestedInput = {
    create?: XOR<categorie_attribut_cenov_dev_ewanCreateWithoutCategorieInput, categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutCategorieInput> | categorie_attribut_cenov_dev_ewanCreateWithoutCategorieInput[] | categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutCategorieInput[]
    connectOrCreate?: categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutCategorieInput | categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutCategorieInput[]
    upsert?: categorie_attribut_cenov_dev_ewanUpsertWithWhereUniqueWithoutCategorieInput | categorie_attribut_cenov_dev_ewanUpsertWithWhereUniqueWithoutCategorieInput[]
    createMany?: categorie_attribut_cenov_dev_ewanCreateManyCategorieInputEnvelope
    set?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    delete?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    connect?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    update?: categorie_attribut_cenov_dev_ewanUpdateWithWhereUniqueWithoutCategorieInput | categorie_attribut_cenov_dev_ewanUpdateWithWhereUniqueWithoutCategorieInput[]
    updateMany?: categorie_attribut_cenov_dev_ewanUpdateManyWithWhereWithoutCategorieInput | categorie_attribut_cenov_dev_ewanUpdateManyWithWhereWithoutCategorieInput[]
    deleteMany?: categorie_attribut_cenov_dev_ewanScalarWhereInput | categorie_attribut_cenov_dev_ewanScalarWhereInput[]
  }

  export type produit_categorie_cenov_dev_ewanUpdateManyWithoutCategorieNestedInput = {
    create?: XOR<produit_categorie_cenov_dev_ewanCreateWithoutCategorieInput, produit_categorie_cenov_dev_ewanUncheckedCreateWithoutCategorieInput> | produit_categorie_cenov_dev_ewanCreateWithoutCategorieInput[] | produit_categorie_cenov_dev_ewanUncheckedCreateWithoutCategorieInput[]
    connectOrCreate?: produit_categorie_cenov_dev_ewanCreateOrConnectWithoutCategorieInput | produit_categorie_cenov_dev_ewanCreateOrConnectWithoutCategorieInput[]
    upsert?: produit_categorie_cenov_dev_ewanUpsertWithWhereUniqueWithoutCategorieInput | produit_categorie_cenov_dev_ewanUpsertWithWhereUniqueWithoutCategorieInput[]
    createMany?: produit_categorie_cenov_dev_ewanCreateManyCategorieInputEnvelope
    set?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    delete?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    connect?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    update?: produit_categorie_cenov_dev_ewanUpdateWithWhereUniqueWithoutCategorieInput | produit_categorie_cenov_dev_ewanUpdateWithWhereUniqueWithoutCategorieInput[]
    updateMany?: produit_categorie_cenov_dev_ewanUpdateManyWithWhereWithoutCategorieInput | produit_categorie_cenov_dev_ewanUpdateManyWithWhereWithoutCategorieInput[]
    deleteMany?: produit_categorie_cenov_dev_ewanScalarWhereInput | produit_categorie_cenov_dev_ewanScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type categorieUncheckedUpdateManyWithoutCategorieNestedInput = {
    create?: XOR<categorieCreateWithoutCategorieInput, categorieUncheckedCreateWithoutCategorieInput> | categorieCreateWithoutCategorieInput[] | categorieUncheckedCreateWithoutCategorieInput[]
    connectOrCreate?: categorieCreateOrConnectWithoutCategorieInput | categorieCreateOrConnectWithoutCategorieInput[]
    upsert?: categorieUpsertWithWhereUniqueWithoutCategorieInput | categorieUpsertWithWhereUniqueWithoutCategorieInput[]
    createMany?: categorieCreateManyCategorieInputEnvelope
    set?: categorieWhereUniqueInput | categorieWhereUniqueInput[]
    disconnect?: categorieWhereUniqueInput | categorieWhereUniqueInput[]
    delete?: categorieWhereUniqueInput | categorieWhereUniqueInput[]
    connect?: categorieWhereUniqueInput | categorieWhereUniqueInput[]
    update?: categorieUpdateWithWhereUniqueWithoutCategorieInput | categorieUpdateWithWhereUniqueWithoutCategorieInput[]
    updateMany?: categorieUpdateManyWithWhereWithoutCategorieInput | categorieUpdateManyWithWhereWithoutCategorieInput[]
    deleteMany?: categorieScalarWhereInput | categorieScalarWhereInput[]
  }

  export type categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieNestedInput = {
    create?: XOR<categorie_attribut_cenov_dev_ewanCreateWithoutCategorieInput, categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutCategorieInput> | categorie_attribut_cenov_dev_ewanCreateWithoutCategorieInput[] | categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutCategorieInput[]
    connectOrCreate?: categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutCategorieInput | categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutCategorieInput[]
    upsert?: categorie_attribut_cenov_dev_ewanUpsertWithWhereUniqueWithoutCategorieInput | categorie_attribut_cenov_dev_ewanUpsertWithWhereUniqueWithoutCategorieInput[]
    createMany?: categorie_attribut_cenov_dev_ewanCreateManyCategorieInputEnvelope
    set?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    delete?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    connect?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    update?: categorie_attribut_cenov_dev_ewanUpdateWithWhereUniqueWithoutCategorieInput | categorie_attribut_cenov_dev_ewanUpdateWithWhereUniqueWithoutCategorieInput[]
    updateMany?: categorie_attribut_cenov_dev_ewanUpdateManyWithWhereWithoutCategorieInput | categorie_attribut_cenov_dev_ewanUpdateManyWithWhereWithoutCategorieInput[]
    deleteMany?: categorie_attribut_cenov_dev_ewanScalarWhereInput | categorie_attribut_cenov_dev_ewanScalarWhereInput[]
  }

  export type produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieNestedInput = {
    create?: XOR<produit_categorie_cenov_dev_ewanCreateWithoutCategorieInput, produit_categorie_cenov_dev_ewanUncheckedCreateWithoutCategorieInput> | produit_categorie_cenov_dev_ewanCreateWithoutCategorieInput[] | produit_categorie_cenov_dev_ewanUncheckedCreateWithoutCategorieInput[]
    connectOrCreate?: produit_categorie_cenov_dev_ewanCreateOrConnectWithoutCategorieInput | produit_categorie_cenov_dev_ewanCreateOrConnectWithoutCategorieInput[]
    upsert?: produit_categorie_cenov_dev_ewanUpsertWithWhereUniqueWithoutCategorieInput | produit_categorie_cenov_dev_ewanUpsertWithWhereUniqueWithoutCategorieInput[]
    createMany?: produit_categorie_cenov_dev_ewanCreateManyCategorieInputEnvelope
    set?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    delete?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    connect?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    update?: produit_categorie_cenov_dev_ewanUpdateWithWhereUniqueWithoutCategorieInput | produit_categorie_cenov_dev_ewanUpdateWithWhereUniqueWithoutCategorieInput[]
    updateMany?: produit_categorie_cenov_dev_ewanUpdateManyWithWhereWithoutCategorieInput | produit_categorie_cenov_dev_ewanUpdateManyWithWhereWithoutCategorieInput[]
    deleteMany?: produit_categorie_cenov_dev_ewanScalarWhereInput | produit_categorie_cenov_dev_ewanScalarWhereInput[]
  }

  export type attribut_cenov_dev_ewanCreateNestedOneWithoutCategorie_attributInput = {
    create?: XOR<attribut_cenov_dev_ewanCreateWithoutCategorie_attributInput, attribut_cenov_dev_ewanUncheckedCreateWithoutCategorie_attributInput>
    connectOrCreate?: attribut_cenov_dev_ewanCreateOrConnectWithoutCategorie_attributInput
    connect?: attribut_cenov_dev_ewanWhereUniqueInput
  }

  export type categorieCreateNestedOneWithoutCategorie_attributInput = {
    create?: XOR<categorieCreateWithoutCategorie_attributInput, categorieUncheckedCreateWithoutCategorie_attributInput>
    connectOrCreate?: categorieCreateOrConnectWithoutCategorie_attributInput
    connect?: categorieWhereUniqueInput
  }

  export type attribut_cenov_dev_ewanUpdateOneRequiredWithoutCategorie_attributNestedInput = {
    create?: XOR<attribut_cenov_dev_ewanCreateWithoutCategorie_attributInput, attribut_cenov_dev_ewanUncheckedCreateWithoutCategorie_attributInput>
    connectOrCreate?: attribut_cenov_dev_ewanCreateOrConnectWithoutCategorie_attributInput
    upsert?: attribut_cenov_dev_ewanUpsertWithoutCategorie_attributInput
    connect?: attribut_cenov_dev_ewanWhereUniqueInput
    update?: XOR<XOR<attribut_cenov_dev_ewanUpdateToOneWithWhereWithoutCategorie_attributInput, attribut_cenov_dev_ewanUpdateWithoutCategorie_attributInput>, attribut_cenov_dev_ewanUncheckedUpdateWithoutCategorie_attributInput>
  }

  export type categorieUpdateOneRequiredWithoutCategorie_attributNestedInput = {
    create?: XOR<categorieCreateWithoutCategorie_attributInput, categorieUncheckedCreateWithoutCategorie_attributInput>
    connectOrCreate?: categorieCreateOrConnectWithoutCategorie_attributInput
    upsert?: categorieUpsertWithoutCategorie_attributInput
    connect?: categorieWhereUniqueInput
    update?: XOR<XOR<categorieUpdateToOneWithWhereWithoutCategorie_attributInput, categorieUpdateWithoutCategorie_attributInput>, categorieUncheckedUpdateWithoutCategorie_attributInput>
  }

  export type produitCreateNestedOneWithoutCross_refInput = {
    create?: XOR<produitCreateWithoutCross_refInput, produitUncheckedCreateWithoutCross_refInput>
    connectOrCreate?: produitCreateOrConnectWithoutCross_refInput
    connect?: produitWhereUniqueInput
  }

  export type produitUpdateOneRequiredWithoutCross_refNestedInput = {
    create?: XOR<produitCreateWithoutCross_refInput, produitUncheckedCreateWithoutCross_refInput>
    connectOrCreate?: produitCreateOrConnectWithoutCross_refInput
    upsert?: produitUpsertWithoutCross_refInput
    connect?: produitWhereUniqueInput
    update?: XOR<XOR<produitUpdateToOneWithWhereWithoutCross_refInput, produitUpdateWithoutCross_refInput>, produitUncheckedUpdateWithoutCross_refInput>
  }

  export type fournisseurCreateNestedOneWithoutFamilleInput = {
    create?: XOR<fournisseurCreateWithoutFamilleInput, fournisseurUncheckedCreateWithoutFamilleInput>
    connectOrCreate?: fournisseurCreateOrConnectWithoutFamilleInput
    connect?: fournisseurWhereUniqueInput
  }

  export type familleCreateNestedOneWithoutOther_familleInput = {
    create?: XOR<familleCreateWithoutOther_familleInput, familleUncheckedCreateWithoutOther_familleInput>
    connectOrCreate?: familleCreateOrConnectWithoutOther_familleInput
    connect?: familleWhereUniqueInput
  }

  export type familleCreateNestedManyWithoutFamilleInput = {
    create?: XOR<familleCreateWithoutFamilleInput, familleUncheckedCreateWithoutFamilleInput> | familleCreateWithoutFamilleInput[] | familleUncheckedCreateWithoutFamilleInput[]
    connectOrCreate?: familleCreateOrConnectWithoutFamilleInput | familleCreateOrConnectWithoutFamilleInput[]
    createMany?: familleCreateManyFamilleInputEnvelope
    connect?: familleWhereUniqueInput | familleWhereUniqueInput[]
  }

  export type familleUncheckedCreateNestedManyWithoutFamilleInput = {
    create?: XOR<familleCreateWithoutFamilleInput, familleUncheckedCreateWithoutFamilleInput> | familleCreateWithoutFamilleInput[] | familleUncheckedCreateWithoutFamilleInput[]
    connectOrCreate?: familleCreateOrConnectWithoutFamilleInput | familleCreateOrConnectWithoutFamilleInput[]
    createMany?: familleCreateManyFamilleInputEnvelope
    connect?: familleWhereUniqueInput | familleWhereUniqueInput[]
  }

  export type fournisseurUpdateOneRequiredWithoutFamilleNestedInput = {
    create?: XOR<fournisseurCreateWithoutFamilleInput, fournisseurUncheckedCreateWithoutFamilleInput>
    connectOrCreate?: fournisseurCreateOrConnectWithoutFamilleInput
    upsert?: fournisseurUpsertWithoutFamilleInput
    connect?: fournisseurWhereUniqueInput
    update?: XOR<XOR<fournisseurUpdateToOneWithWhereWithoutFamilleInput, fournisseurUpdateWithoutFamilleInput>, fournisseurUncheckedUpdateWithoutFamilleInput>
  }

  export type familleUpdateOneWithoutOther_familleNestedInput = {
    create?: XOR<familleCreateWithoutOther_familleInput, familleUncheckedCreateWithoutOther_familleInput>
    connectOrCreate?: familleCreateOrConnectWithoutOther_familleInput
    upsert?: familleUpsertWithoutOther_familleInput
    disconnect?: familleWhereInput | boolean
    delete?: familleWhereInput | boolean
    connect?: familleWhereUniqueInput
    update?: XOR<XOR<familleUpdateToOneWithWhereWithoutOther_familleInput, familleUpdateWithoutOther_familleInput>, familleUncheckedUpdateWithoutOther_familleInput>
  }

  export type familleUpdateManyWithoutFamilleNestedInput = {
    create?: XOR<familleCreateWithoutFamilleInput, familleUncheckedCreateWithoutFamilleInput> | familleCreateWithoutFamilleInput[] | familleUncheckedCreateWithoutFamilleInput[]
    connectOrCreate?: familleCreateOrConnectWithoutFamilleInput | familleCreateOrConnectWithoutFamilleInput[]
    upsert?: familleUpsertWithWhereUniqueWithoutFamilleInput | familleUpsertWithWhereUniqueWithoutFamilleInput[]
    createMany?: familleCreateManyFamilleInputEnvelope
    set?: familleWhereUniqueInput | familleWhereUniqueInput[]
    disconnect?: familleWhereUniqueInput | familleWhereUniqueInput[]
    delete?: familleWhereUniqueInput | familleWhereUniqueInput[]
    connect?: familleWhereUniqueInput | familleWhereUniqueInput[]
    update?: familleUpdateWithWhereUniqueWithoutFamilleInput | familleUpdateWithWhereUniqueWithoutFamilleInput[]
    updateMany?: familleUpdateManyWithWhereWithoutFamilleInput | familleUpdateManyWithWhereWithoutFamilleInput[]
    deleteMany?: familleScalarWhereInput | familleScalarWhereInput[]
  }

  export type familleUncheckedUpdateManyWithoutFamilleNestedInput = {
    create?: XOR<familleCreateWithoutFamilleInput, familleUncheckedCreateWithoutFamilleInput> | familleCreateWithoutFamilleInput[] | familleUncheckedCreateWithoutFamilleInput[]
    connectOrCreate?: familleCreateOrConnectWithoutFamilleInput | familleCreateOrConnectWithoutFamilleInput[]
    upsert?: familleUpsertWithWhereUniqueWithoutFamilleInput | familleUpsertWithWhereUniqueWithoutFamilleInput[]
    createMany?: familleCreateManyFamilleInputEnvelope
    set?: familleWhereUniqueInput | familleWhereUniqueInput[]
    disconnect?: familleWhereUniqueInput | familleWhereUniqueInput[]
    delete?: familleWhereUniqueInput | familleWhereUniqueInput[]
    connect?: familleWhereUniqueInput | familleWhereUniqueInput[]
    update?: familleUpdateWithWhereUniqueWithoutFamilleInput | familleUpdateWithWhereUniqueWithoutFamilleInput[]
    updateMany?: familleUpdateManyWithWhereWithoutFamilleInput | familleUpdateManyWithWhereWithoutFamilleInput[]
    deleteMany?: familleScalarWhereInput | familleScalarWhereInput[]
  }

  export type cross_refCreateNestedManyWithoutProduitInput = {
    create?: XOR<cross_refCreateWithoutProduitInput, cross_refUncheckedCreateWithoutProduitInput> | cross_refCreateWithoutProduitInput[] | cross_refUncheckedCreateWithoutProduitInput[]
    connectOrCreate?: cross_refCreateOrConnectWithoutProduitInput | cross_refCreateOrConnectWithoutProduitInput[]
    createMany?: cross_refCreateManyProduitInputEnvelope
    connect?: cross_refWhereUniqueInput | cross_refWhereUniqueInput[]
  }

  export type kit_cenov_dev_ewanCreateNestedOneWithoutProduitInput = {
    create?: XOR<kit_cenov_dev_ewanCreateWithoutProduitInput, kit_cenov_dev_ewanUncheckedCreateWithoutProduitInput>
    connectOrCreate?: kit_cenov_dev_ewanCreateOrConnectWithoutProduitInput
    connect?: kit_cenov_dev_ewanWhereUniqueInput
  }

  export type fournisseurCreateNestedOneWithoutProduitInput = {
    create?: XOR<fournisseurCreateWithoutProduitInput, fournisseurUncheckedCreateWithoutProduitInput>
    connectOrCreate?: fournisseurCreateOrConnectWithoutProduitInput
    connect?: fournisseurWhereUniqueInput
  }

  export type produit_categorie_cenov_dev_ewanCreateNestedManyWithoutProduitInput = {
    create?: XOR<produit_categorie_cenov_dev_ewanCreateWithoutProduitInput, produit_categorie_cenov_dev_ewanUncheckedCreateWithoutProduitInput> | produit_categorie_cenov_dev_ewanCreateWithoutProduitInput[] | produit_categorie_cenov_dev_ewanUncheckedCreateWithoutProduitInput[]
    connectOrCreate?: produit_categorie_cenov_dev_ewanCreateOrConnectWithoutProduitInput | produit_categorie_cenov_dev_ewanCreateOrConnectWithoutProduitInput[]
    createMany?: produit_categorie_cenov_dev_ewanCreateManyProduitInputEnvelope
    connect?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
  }

  export type tarif_achat_cenov_dev_ewanCreateNestedManyWithoutProduitInput = {
    create?: XOR<tarif_achat_cenov_dev_ewanCreateWithoutProduitInput, tarif_achat_cenov_dev_ewanUncheckedCreateWithoutProduitInput> | tarif_achat_cenov_dev_ewanCreateWithoutProduitInput[] | tarif_achat_cenov_dev_ewanUncheckedCreateWithoutProduitInput[]
    connectOrCreate?: tarif_achat_cenov_dev_ewanCreateOrConnectWithoutProduitInput | tarif_achat_cenov_dev_ewanCreateOrConnectWithoutProduitInput[]
    createMany?: tarif_achat_cenov_dev_ewanCreateManyProduitInputEnvelope
    connect?: tarif_achat_cenov_dev_ewanWhereUniqueInput | tarif_achat_cenov_dev_ewanWhereUniqueInput[]
  }

  export type cross_refUncheckedCreateNestedManyWithoutProduitInput = {
    create?: XOR<cross_refCreateWithoutProduitInput, cross_refUncheckedCreateWithoutProduitInput> | cross_refCreateWithoutProduitInput[] | cross_refUncheckedCreateWithoutProduitInput[]
    connectOrCreate?: cross_refCreateOrConnectWithoutProduitInput | cross_refCreateOrConnectWithoutProduitInput[]
    createMany?: cross_refCreateManyProduitInputEnvelope
    connect?: cross_refWhereUniqueInput | cross_refWhereUniqueInput[]
  }

  export type produit_categorie_cenov_dev_ewanUncheckedCreateNestedManyWithoutProduitInput = {
    create?: XOR<produit_categorie_cenov_dev_ewanCreateWithoutProduitInput, produit_categorie_cenov_dev_ewanUncheckedCreateWithoutProduitInput> | produit_categorie_cenov_dev_ewanCreateWithoutProduitInput[] | produit_categorie_cenov_dev_ewanUncheckedCreateWithoutProduitInput[]
    connectOrCreate?: produit_categorie_cenov_dev_ewanCreateOrConnectWithoutProduitInput | produit_categorie_cenov_dev_ewanCreateOrConnectWithoutProduitInput[]
    createMany?: produit_categorie_cenov_dev_ewanCreateManyProduitInputEnvelope
    connect?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
  }

  export type tarif_achat_cenov_dev_ewanUncheckedCreateNestedManyWithoutProduitInput = {
    create?: XOR<tarif_achat_cenov_dev_ewanCreateWithoutProduitInput, tarif_achat_cenov_dev_ewanUncheckedCreateWithoutProduitInput> | tarif_achat_cenov_dev_ewanCreateWithoutProduitInput[] | tarif_achat_cenov_dev_ewanUncheckedCreateWithoutProduitInput[]
    connectOrCreate?: tarif_achat_cenov_dev_ewanCreateOrConnectWithoutProduitInput | tarif_achat_cenov_dev_ewanCreateOrConnectWithoutProduitInput[]
    createMany?: tarif_achat_cenov_dev_ewanCreateManyProduitInputEnvelope
    connect?: tarif_achat_cenov_dev_ewanWhereUniqueInput | tarif_achat_cenov_dev_ewanWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type cross_refUpdateManyWithoutProduitNestedInput = {
    create?: XOR<cross_refCreateWithoutProduitInput, cross_refUncheckedCreateWithoutProduitInput> | cross_refCreateWithoutProduitInput[] | cross_refUncheckedCreateWithoutProduitInput[]
    connectOrCreate?: cross_refCreateOrConnectWithoutProduitInput | cross_refCreateOrConnectWithoutProduitInput[]
    upsert?: cross_refUpsertWithWhereUniqueWithoutProduitInput | cross_refUpsertWithWhereUniqueWithoutProduitInput[]
    createMany?: cross_refCreateManyProduitInputEnvelope
    set?: cross_refWhereUniqueInput | cross_refWhereUniqueInput[]
    disconnect?: cross_refWhereUniqueInput | cross_refWhereUniqueInput[]
    delete?: cross_refWhereUniqueInput | cross_refWhereUniqueInput[]
    connect?: cross_refWhereUniqueInput | cross_refWhereUniqueInput[]
    update?: cross_refUpdateWithWhereUniqueWithoutProduitInput | cross_refUpdateWithWhereUniqueWithoutProduitInput[]
    updateMany?: cross_refUpdateManyWithWhereWithoutProduitInput | cross_refUpdateManyWithWhereWithoutProduitInput[]
    deleteMany?: cross_refScalarWhereInput | cross_refScalarWhereInput[]
  }

  export type kit_cenov_dev_ewanUpdateOneWithoutProduitNestedInput = {
    create?: XOR<kit_cenov_dev_ewanCreateWithoutProduitInput, kit_cenov_dev_ewanUncheckedCreateWithoutProduitInput>
    connectOrCreate?: kit_cenov_dev_ewanCreateOrConnectWithoutProduitInput
    upsert?: kit_cenov_dev_ewanUpsertWithoutProduitInput
    disconnect?: kit_cenov_dev_ewanWhereInput | boolean
    delete?: kit_cenov_dev_ewanWhereInput | boolean
    connect?: kit_cenov_dev_ewanWhereUniqueInput
    update?: XOR<XOR<kit_cenov_dev_ewanUpdateToOneWithWhereWithoutProduitInput, kit_cenov_dev_ewanUpdateWithoutProduitInput>, kit_cenov_dev_ewanUncheckedUpdateWithoutProduitInput>
  }

  export type fournisseurUpdateOneWithoutProduitNestedInput = {
    create?: XOR<fournisseurCreateWithoutProduitInput, fournisseurUncheckedCreateWithoutProduitInput>
    connectOrCreate?: fournisseurCreateOrConnectWithoutProduitInput
    upsert?: fournisseurUpsertWithoutProduitInput
    disconnect?: fournisseurWhereInput | boolean
    delete?: fournisseurWhereInput | boolean
    connect?: fournisseurWhereUniqueInput
    update?: XOR<XOR<fournisseurUpdateToOneWithWhereWithoutProduitInput, fournisseurUpdateWithoutProduitInput>, fournisseurUncheckedUpdateWithoutProduitInput>
  }

  export type produit_categorie_cenov_dev_ewanUpdateManyWithoutProduitNestedInput = {
    create?: XOR<produit_categorie_cenov_dev_ewanCreateWithoutProduitInput, produit_categorie_cenov_dev_ewanUncheckedCreateWithoutProduitInput> | produit_categorie_cenov_dev_ewanCreateWithoutProduitInput[] | produit_categorie_cenov_dev_ewanUncheckedCreateWithoutProduitInput[]
    connectOrCreate?: produit_categorie_cenov_dev_ewanCreateOrConnectWithoutProduitInput | produit_categorie_cenov_dev_ewanCreateOrConnectWithoutProduitInput[]
    upsert?: produit_categorie_cenov_dev_ewanUpsertWithWhereUniqueWithoutProduitInput | produit_categorie_cenov_dev_ewanUpsertWithWhereUniqueWithoutProduitInput[]
    createMany?: produit_categorie_cenov_dev_ewanCreateManyProduitInputEnvelope
    set?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    delete?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    connect?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    update?: produit_categorie_cenov_dev_ewanUpdateWithWhereUniqueWithoutProduitInput | produit_categorie_cenov_dev_ewanUpdateWithWhereUniqueWithoutProduitInput[]
    updateMany?: produit_categorie_cenov_dev_ewanUpdateManyWithWhereWithoutProduitInput | produit_categorie_cenov_dev_ewanUpdateManyWithWhereWithoutProduitInput[]
    deleteMany?: produit_categorie_cenov_dev_ewanScalarWhereInput | produit_categorie_cenov_dev_ewanScalarWhereInput[]
  }

  export type tarif_achat_cenov_dev_ewanUpdateManyWithoutProduitNestedInput = {
    create?: XOR<tarif_achat_cenov_dev_ewanCreateWithoutProduitInput, tarif_achat_cenov_dev_ewanUncheckedCreateWithoutProduitInput> | tarif_achat_cenov_dev_ewanCreateWithoutProduitInput[] | tarif_achat_cenov_dev_ewanUncheckedCreateWithoutProduitInput[]
    connectOrCreate?: tarif_achat_cenov_dev_ewanCreateOrConnectWithoutProduitInput | tarif_achat_cenov_dev_ewanCreateOrConnectWithoutProduitInput[]
    upsert?: tarif_achat_cenov_dev_ewanUpsertWithWhereUniqueWithoutProduitInput | tarif_achat_cenov_dev_ewanUpsertWithWhereUniqueWithoutProduitInput[]
    createMany?: tarif_achat_cenov_dev_ewanCreateManyProduitInputEnvelope
    set?: tarif_achat_cenov_dev_ewanWhereUniqueInput | tarif_achat_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: tarif_achat_cenov_dev_ewanWhereUniqueInput | tarif_achat_cenov_dev_ewanWhereUniqueInput[]
    delete?: tarif_achat_cenov_dev_ewanWhereUniqueInput | tarif_achat_cenov_dev_ewanWhereUniqueInput[]
    connect?: tarif_achat_cenov_dev_ewanWhereUniqueInput | tarif_achat_cenov_dev_ewanWhereUniqueInput[]
    update?: tarif_achat_cenov_dev_ewanUpdateWithWhereUniqueWithoutProduitInput | tarif_achat_cenov_dev_ewanUpdateWithWhereUniqueWithoutProduitInput[]
    updateMany?: tarif_achat_cenov_dev_ewanUpdateManyWithWhereWithoutProduitInput | tarif_achat_cenov_dev_ewanUpdateManyWithWhereWithoutProduitInput[]
    deleteMany?: tarif_achat_cenov_dev_ewanScalarWhereInput | tarif_achat_cenov_dev_ewanScalarWhereInput[]
  }

  export type cross_refUncheckedUpdateManyWithoutProduitNestedInput = {
    create?: XOR<cross_refCreateWithoutProduitInput, cross_refUncheckedCreateWithoutProduitInput> | cross_refCreateWithoutProduitInput[] | cross_refUncheckedCreateWithoutProduitInput[]
    connectOrCreate?: cross_refCreateOrConnectWithoutProduitInput | cross_refCreateOrConnectWithoutProduitInput[]
    upsert?: cross_refUpsertWithWhereUniqueWithoutProduitInput | cross_refUpsertWithWhereUniqueWithoutProduitInput[]
    createMany?: cross_refCreateManyProduitInputEnvelope
    set?: cross_refWhereUniqueInput | cross_refWhereUniqueInput[]
    disconnect?: cross_refWhereUniqueInput | cross_refWhereUniqueInput[]
    delete?: cross_refWhereUniqueInput | cross_refWhereUniqueInput[]
    connect?: cross_refWhereUniqueInput | cross_refWhereUniqueInput[]
    update?: cross_refUpdateWithWhereUniqueWithoutProduitInput | cross_refUpdateWithWhereUniqueWithoutProduitInput[]
    updateMany?: cross_refUpdateManyWithWhereWithoutProduitInput | cross_refUpdateManyWithWhereWithoutProduitInput[]
    deleteMany?: cross_refScalarWhereInput | cross_refScalarWhereInput[]
  }

  export type produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutProduitNestedInput = {
    create?: XOR<produit_categorie_cenov_dev_ewanCreateWithoutProduitInput, produit_categorie_cenov_dev_ewanUncheckedCreateWithoutProduitInput> | produit_categorie_cenov_dev_ewanCreateWithoutProduitInput[] | produit_categorie_cenov_dev_ewanUncheckedCreateWithoutProduitInput[]
    connectOrCreate?: produit_categorie_cenov_dev_ewanCreateOrConnectWithoutProduitInput | produit_categorie_cenov_dev_ewanCreateOrConnectWithoutProduitInput[]
    upsert?: produit_categorie_cenov_dev_ewanUpsertWithWhereUniqueWithoutProduitInput | produit_categorie_cenov_dev_ewanUpsertWithWhereUniqueWithoutProduitInput[]
    createMany?: produit_categorie_cenov_dev_ewanCreateManyProduitInputEnvelope
    set?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    delete?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    connect?: produit_categorie_cenov_dev_ewanWhereUniqueInput | produit_categorie_cenov_dev_ewanWhereUniqueInput[]
    update?: produit_categorie_cenov_dev_ewanUpdateWithWhereUniqueWithoutProduitInput | produit_categorie_cenov_dev_ewanUpdateWithWhereUniqueWithoutProduitInput[]
    updateMany?: produit_categorie_cenov_dev_ewanUpdateManyWithWhereWithoutProduitInput | produit_categorie_cenov_dev_ewanUpdateManyWithWhereWithoutProduitInput[]
    deleteMany?: produit_categorie_cenov_dev_ewanScalarWhereInput | produit_categorie_cenov_dev_ewanScalarWhereInput[]
  }

  export type tarif_achat_cenov_dev_ewanUncheckedUpdateManyWithoutProduitNestedInput = {
    create?: XOR<tarif_achat_cenov_dev_ewanCreateWithoutProduitInput, tarif_achat_cenov_dev_ewanUncheckedCreateWithoutProduitInput> | tarif_achat_cenov_dev_ewanCreateWithoutProduitInput[] | tarif_achat_cenov_dev_ewanUncheckedCreateWithoutProduitInput[]
    connectOrCreate?: tarif_achat_cenov_dev_ewanCreateOrConnectWithoutProduitInput | tarif_achat_cenov_dev_ewanCreateOrConnectWithoutProduitInput[]
    upsert?: tarif_achat_cenov_dev_ewanUpsertWithWhereUniqueWithoutProduitInput | tarif_achat_cenov_dev_ewanUpsertWithWhereUniqueWithoutProduitInput[]
    createMany?: tarif_achat_cenov_dev_ewanCreateManyProduitInputEnvelope
    set?: tarif_achat_cenov_dev_ewanWhereUniqueInput | tarif_achat_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: tarif_achat_cenov_dev_ewanWhereUniqueInput | tarif_achat_cenov_dev_ewanWhereUniqueInput[]
    delete?: tarif_achat_cenov_dev_ewanWhereUniqueInput | tarif_achat_cenov_dev_ewanWhereUniqueInput[]
    connect?: tarif_achat_cenov_dev_ewanWhereUniqueInput | tarif_achat_cenov_dev_ewanWhereUniqueInput[]
    update?: tarif_achat_cenov_dev_ewanUpdateWithWhereUniqueWithoutProduitInput | tarif_achat_cenov_dev_ewanUpdateWithWhereUniqueWithoutProduitInput[]
    updateMany?: tarif_achat_cenov_dev_ewanUpdateManyWithWhereWithoutProduitInput | tarif_achat_cenov_dev_ewanUpdateManyWithWhereWithoutProduitInput[]
    deleteMany?: tarif_achat_cenov_dev_ewanScalarWhereInput | tarif_achat_cenov_dev_ewanScalarWhereInput[]
  }

  export type categorieCreateNestedOneWithoutProduit_categorieInput = {
    create?: XOR<categorieCreateWithoutProduit_categorieInput, categorieUncheckedCreateWithoutProduit_categorieInput>
    connectOrCreate?: categorieCreateOrConnectWithoutProduit_categorieInput
    connect?: categorieWhereUniqueInput
  }

  export type produitCreateNestedOneWithoutProduit_categorieInput = {
    create?: XOR<produitCreateWithoutProduit_categorieInput, produitUncheckedCreateWithoutProduit_categorieInput>
    connectOrCreate?: produitCreateOrConnectWithoutProduit_categorieInput
    connect?: produitWhereUniqueInput
  }

  export type categorieUpdateOneRequiredWithoutProduit_categorieNestedInput = {
    create?: XOR<categorieCreateWithoutProduit_categorieInput, categorieUncheckedCreateWithoutProduit_categorieInput>
    connectOrCreate?: categorieCreateOrConnectWithoutProduit_categorieInput
    upsert?: categorieUpsertWithoutProduit_categorieInput
    connect?: categorieWhereUniqueInput
    update?: XOR<XOR<categorieUpdateToOneWithWhereWithoutProduit_categorieInput, categorieUpdateWithoutProduit_categorieInput>, categorieUncheckedUpdateWithoutProduit_categorieInput>
  }

  export type produitUpdateOneRequiredWithoutProduit_categorieNestedInput = {
    create?: XOR<produitCreateWithoutProduit_categorieInput, produitUncheckedCreateWithoutProduit_categorieInput>
    connectOrCreate?: produitCreateOrConnectWithoutProduit_categorieInput
    upsert?: produitUpsertWithoutProduit_categorieInput
    connect?: produitWhereUniqueInput
    update?: XOR<XOR<produitUpdateToOneWithWhereWithoutProduit_categorieInput, produitUpdateWithoutProduit_categorieInput>, produitUncheckedUpdateWithoutProduit_categorieInput>
  }

  export type produitCreateNestedOneWithoutTarif_achatInput = {
    create?: XOR<produitCreateWithoutTarif_achatInput, produitUncheckedCreateWithoutTarif_achatInput>
    connectOrCreate?: produitCreateOrConnectWithoutTarif_achatInput
    connect?: produitWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type produitUpdateOneRequiredWithoutTarif_achatNestedInput = {
    create?: XOR<produitCreateWithoutTarif_achatInput, produitUncheckedCreateWithoutTarif_achatInput>
    connectOrCreate?: produitCreateOrConnectWithoutTarif_achatInput
    upsert?: produitUpsertWithoutTarif_achatInput
    connect?: produitWhereUniqueInput
    update?: XOR<XOR<produitUpdateToOneWithWhereWithoutTarif_achatInput, produitUpdateWithoutTarif_achatInput>, produitUncheckedUpdateWithoutTarif_achatInput>
  }

  export type categorie_attribut_cenov_dev_ewanCreateNestedManyWithoutAttributInput = {
    create?: XOR<categorie_attribut_cenov_dev_ewanCreateWithoutAttributInput, categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutAttributInput> | categorie_attribut_cenov_dev_ewanCreateWithoutAttributInput[] | categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutAttributInput[]
    connectOrCreate?: categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutAttributInput | categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutAttributInput[]
    createMany?: categorie_attribut_cenov_dev_ewanCreateManyAttributInputEnvelope
    connect?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
  }

  export type kit_attribute_cenov_dev_ewanCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput = {
    create?: XOR<kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput> | kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[] | kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    connectOrCreate?: kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput | kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    createMany?: kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_caracToattributInputEnvelope
    connect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
  }

  export type kit_attribute_cenov_dev_ewanCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput = {
    create?: XOR<kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput> | kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[] | kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    connectOrCreate?: kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput | kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    createMany?: kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_unitToattributInputEnvelope
    connect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
  }

  export type categorie_attribut_cenov_dev_ewanUncheckedCreateNestedManyWithoutAttributInput = {
    create?: XOR<categorie_attribut_cenov_dev_ewanCreateWithoutAttributInput, categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutAttributInput> | categorie_attribut_cenov_dev_ewanCreateWithoutAttributInput[] | categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutAttributInput[]
    connectOrCreate?: categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutAttributInput | categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutAttributInput[]
    createMany?: categorie_attribut_cenov_dev_ewanCreateManyAttributInputEnvelope
    connect?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
  }

  export type kit_attribute_cenov_dev_ewanUncheckedCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput = {
    create?: XOR<kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput> | kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[] | kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    connectOrCreate?: kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput | kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    createMany?: kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_caracToattributInputEnvelope
    connect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
  }

  export type kit_attribute_cenov_dev_ewanUncheckedCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput = {
    create?: XOR<kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput> | kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[] | kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    connectOrCreate?: kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput | kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    createMany?: kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_unitToattributInputEnvelope
    connect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
  }

  export type categorie_attribut_cenov_dev_ewanUpdateManyWithoutAttributNestedInput = {
    create?: XOR<categorie_attribut_cenov_dev_ewanCreateWithoutAttributInput, categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutAttributInput> | categorie_attribut_cenov_dev_ewanCreateWithoutAttributInput[] | categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutAttributInput[]
    connectOrCreate?: categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutAttributInput | categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutAttributInput[]
    upsert?: categorie_attribut_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttributInput | categorie_attribut_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttributInput[]
    createMany?: categorie_attribut_cenov_dev_ewanCreateManyAttributInputEnvelope
    set?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    delete?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    connect?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    update?: categorie_attribut_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttributInput | categorie_attribut_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttributInput[]
    updateMany?: categorie_attribut_cenov_dev_ewanUpdateManyWithWhereWithoutAttributInput | categorie_attribut_cenov_dev_ewanUpdateManyWithWhereWithoutAttributInput[]
    deleteMany?: categorie_attribut_cenov_dev_ewanScalarWhereInput | categorie_attribut_cenov_dev_ewanScalarWhereInput[]
  }

  export type kit_attribute_cenov_dev_ewanUpdateManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributNestedInput = {
    create?: XOR<kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput> | kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[] | kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    connectOrCreate?: kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput | kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    upsert?: kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput | kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    createMany?: kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_caracToattributInputEnvelope
    set?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    delete?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    connect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    update?: kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput | kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    updateMany?: kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput | kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    deleteMany?: kit_attribute_cenov_dev_ewanScalarWhereInput | kit_attribute_cenov_dev_ewanScalarWhereInput[]
  }

  export type kit_attribute_cenov_dev_ewanUpdateManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributNestedInput = {
    create?: XOR<kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput> | kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[] | kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    connectOrCreate?: kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput | kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    upsert?: kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput | kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    createMany?: kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_unitToattributInputEnvelope
    set?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    delete?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    connect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    update?: kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput | kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    updateMany?: kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput | kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    deleteMany?: kit_attribute_cenov_dev_ewanScalarWhereInput | kit_attribute_cenov_dev_ewanScalarWhereInput[]
  }

  export type categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutAttributNestedInput = {
    create?: XOR<categorie_attribut_cenov_dev_ewanCreateWithoutAttributInput, categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutAttributInput> | categorie_attribut_cenov_dev_ewanCreateWithoutAttributInput[] | categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutAttributInput[]
    connectOrCreate?: categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutAttributInput | categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutAttributInput[]
    upsert?: categorie_attribut_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttributInput | categorie_attribut_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttributInput[]
    createMany?: categorie_attribut_cenov_dev_ewanCreateManyAttributInputEnvelope
    set?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    delete?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    connect?: categorie_attribut_cenov_dev_ewanWhereUniqueInput | categorie_attribut_cenov_dev_ewanWhereUniqueInput[]
    update?: categorie_attribut_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttributInput | categorie_attribut_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttributInput[]
    updateMany?: categorie_attribut_cenov_dev_ewanUpdateManyWithWhereWithoutAttributInput | categorie_attribut_cenov_dev_ewanUpdateManyWithWhereWithoutAttributInput[]
    deleteMany?: categorie_attribut_cenov_dev_ewanScalarWhereInput | categorie_attribut_cenov_dev_ewanScalarWhereInput[]
  }

  export type kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributNestedInput = {
    create?: XOR<kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput> | kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[] | kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    connectOrCreate?: kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput | kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    upsert?: kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput | kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    createMany?: kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_caracToattributInputEnvelope
    set?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    delete?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    connect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    update?: kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput | kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    updateMany?: kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput | kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    deleteMany?: kit_attribute_cenov_dev_ewanScalarWhereInput | kit_attribute_cenov_dev_ewanScalarWhereInput[]
  }

  export type kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributNestedInput = {
    create?: XOR<kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput> | kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[] | kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    connectOrCreate?: kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput | kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    upsert?: kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput | kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    createMany?: kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_unitToattributInputEnvelope
    set?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    delete?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    connect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    update?: kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput | kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    updateMany?: kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput | kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    deleteMany?: kit_attribute_cenov_dev_ewanScalarWhereInput | kit_attribute_cenov_dev_ewanScalarWhereInput[]
  }

  export type familleCreateNestedManyWithoutFournisseurInput = {
    create?: XOR<familleCreateWithoutFournisseurInput, familleUncheckedCreateWithoutFournisseurInput> | familleCreateWithoutFournisseurInput[] | familleUncheckedCreateWithoutFournisseurInput[]
    connectOrCreate?: familleCreateOrConnectWithoutFournisseurInput | familleCreateOrConnectWithoutFournisseurInput[]
    createMany?: familleCreateManyFournisseurInputEnvelope
    connect?: familleWhereUniqueInput | familleWhereUniqueInput[]
  }

  export type produitCreateNestedManyWithoutFournisseurInput = {
    create?: XOR<produitCreateWithoutFournisseurInput, produitUncheckedCreateWithoutFournisseurInput> | produitCreateWithoutFournisseurInput[] | produitUncheckedCreateWithoutFournisseurInput[]
    connectOrCreate?: produitCreateOrConnectWithoutFournisseurInput | produitCreateOrConnectWithoutFournisseurInput[]
    createMany?: produitCreateManyFournisseurInputEnvelope
    connect?: produitWhereUniqueInput | produitWhereUniqueInput[]
  }

  export type familleUncheckedCreateNestedManyWithoutFournisseurInput = {
    create?: XOR<familleCreateWithoutFournisseurInput, familleUncheckedCreateWithoutFournisseurInput> | familleCreateWithoutFournisseurInput[] | familleUncheckedCreateWithoutFournisseurInput[]
    connectOrCreate?: familleCreateOrConnectWithoutFournisseurInput | familleCreateOrConnectWithoutFournisseurInput[]
    createMany?: familleCreateManyFournisseurInputEnvelope
    connect?: familleWhereUniqueInput | familleWhereUniqueInput[]
  }

  export type produitUncheckedCreateNestedManyWithoutFournisseurInput = {
    create?: XOR<produitCreateWithoutFournisseurInput, produitUncheckedCreateWithoutFournisseurInput> | produitCreateWithoutFournisseurInput[] | produitUncheckedCreateWithoutFournisseurInput[]
    connectOrCreate?: produitCreateOrConnectWithoutFournisseurInput | produitCreateOrConnectWithoutFournisseurInput[]
    createMany?: produitCreateManyFournisseurInputEnvelope
    connect?: produitWhereUniqueInput | produitWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type familleUpdateManyWithoutFournisseurNestedInput = {
    create?: XOR<familleCreateWithoutFournisseurInput, familleUncheckedCreateWithoutFournisseurInput> | familleCreateWithoutFournisseurInput[] | familleUncheckedCreateWithoutFournisseurInput[]
    connectOrCreate?: familleCreateOrConnectWithoutFournisseurInput | familleCreateOrConnectWithoutFournisseurInput[]
    upsert?: familleUpsertWithWhereUniqueWithoutFournisseurInput | familleUpsertWithWhereUniqueWithoutFournisseurInput[]
    createMany?: familleCreateManyFournisseurInputEnvelope
    set?: familleWhereUniqueInput | familleWhereUniqueInput[]
    disconnect?: familleWhereUniqueInput | familleWhereUniqueInput[]
    delete?: familleWhereUniqueInput | familleWhereUniqueInput[]
    connect?: familleWhereUniqueInput | familleWhereUniqueInput[]
    update?: familleUpdateWithWhereUniqueWithoutFournisseurInput | familleUpdateWithWhereUniqueWithoutFournisseurInput[]
    updateMany?: familleUpdateManyWithWhereWithoutFournisseurInput | familleUpdateManyWithWhereWithoutFournisseurInput[]
    deleteMany?: familleScalarWhereInput | familleScalarWhereInput[]
  }

  export type produitUpdateManyWithoutFournisseurNestedInput = {
    create?: XOR<produitCreateWithoutFournisseurInput, produitUncheckedCreateWithoutFournisseurInput> | produitCreateWithoutFournisseurInput[] | produitUncheckedCreateWithoutFournisseurInput[]
    connectOrCreate?: produitCreateOrConnectWithoutFournisseurInput | produitCreateOrConnectWithoutFournisseurInput[]
    upsert?: produitUpsertWithWhereUniqueWithoutFournisseurInput | produitUpsertWithWhereUniqueWithoutFournisseurInput[]
    createMany?: produitCreateManyFournisseurInputEnvelope
    set?: produitWhereUniqueInput | produitWhereUniqueInput[]
    disconnect?: produitWhereUniqueInput | produitWhereUniqueInput[]
    delete?: produitWhereUniqueInput | produitWhereUniqueInput[]
    connect?: produitWhereUniqueInput | produitWhereUniqueInput[]
    update?: produitUpdateWithWhereUniqueWithoutFournisseurInput | produitUpdateWithWhereUniqueWithoutFournisseurInput[]
    updateMany?: produitUpdateManyWithWhereWithoutFournisseurInput | produitUpdateManyWithWhereWithoutFournisseurInput[]
    deleteMany?: produitScalarWhereInput | produitScalarWhereInput[]
  }

  export type familleUncheckedUpdateManyWithoutFournisseurNestedInput = {
    create?: XOR<familleCreateWithoutFournisseurInput, familleUncheckedCreateWithoutFournisseurInput> | familleCreateWithoutFournisseurInput[] | familleUncheckedCreateWithoutFournisseurInput[]
    connectOrCreate?: familleCreateOrConnectWithoutFournisseurInput | familleCreateOrConnectWithoutFournisseurInput[]
    upsert?: familleUpsertWithWhereUniqueWithoutFournisseurInput | familleUpsertWithWhereUniqueWithoutFournisseurInput[]
    createMany?: familleCreateManyFournisseurInputEnvelope
    set?: familleWhereUniqueInput | familleWhereUniqueInput[]
    disconnect?: familleWhereUniqueInput | familleWhereUniqueInput[]
    delete?: familleWhereUniqueInput | familleWhereUniqueInput[]
    connect?: familleWhereUniqueInput | familleWhereUniqueInput[]
    update?: familleUpdateWithWhereUniqueWithoutFournisseurInput | familleUpdateWithWhereUniqueWithoutFournisseurInput[]
    updateMany?: familleUpdateManyWithWhereWithoutFournisseurInput | familleUpdateManyWithWhereWithoutFournisseurInput[]
    deleteMany?: familleScalarWhereInput | familleScalarWhereInput[]
  }

  export type produitUncheckedUpdateManyWithoutFournisseurNestedInput = {
    create?: XOR<produitCreateWithoutFournisseurInput, produitUncheckedCreateWithoutFournisseurInput> | produitCreateWithoutFournisseurInput[] | produitUncheckedCreateWithoutFournisseurInput[]
    connectOrCreate?: produitCreateOrConnectWithoutFournisseurInput | produitCreateOrConnectWithoutFournisseurInput[]
    upsert?: produitUpsertWithWhereUniqueWithoutFournisseurInput | produitUpsertWithWhereUniqueWithoutFournisseurInput[]
    createMany?: produitCreateManyFournisseurInputEnvelope
    set?: produitWhereUniqueInput | produitWhereUniqueInput[]
    disconnect?: produitWhereUniqueInput | produitWhereUniqueInput[]
    delete?: produitWhereUniqueInput | produitWhereUniqueInput[]
    connect?: produitWhereUniqueInput | produitWhereUniqueInput[]
    update?: produitUpdateWithWhereUniqueWithoutFournisseurInput | produitUpdateWithWhereUniqueWithoutFournisseurInput[]
    updateMany?: produitUpdateManyWithWhereWithoutFournisseurInput | produitUpdateManyWithWhereWithoutFournisseurInput[]
    deleteMany?: produitScalarWhereInput | produitScalarWhereInput[]
  }

  export type produitCreateNestedManyWithoutKitInput = {
    create?: XOR<produitCreateWithoutKitInput, produitUncheckedCreateWithoutKitInput> | produitCreateWithoutKitInput[] | produitUncheckedCreateWithoutKitInput[]
    connectOrCreate?: produitCreateOrConnectWithoutKitInput | produitCreateOrConnectWithoutKitInput[]
    createMany?: produitCreateManyKitInputEnvelope
    connect?: produitWhereUniqueInput | produitWhereUniqueInput[]
  }

  export type kit_attribute_cenov_dev_ewanCreateNestedManyWithoutKitInput = {
    create?: XOR<kit_attribute_cenov_dev_ewanCreateWithoutKitInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutKitInput> | kit_attribute_cenov_dev_ewanCreateWithoutKitInput[] | kit_attribute_cenov_dev_ewanUncheckedCreateWithoutKitInput[]
    connectOrCreate?: kit_attribute_cenov_dev_ewanCreateOrConnectWithoutKitInput | kit_attribute_cenov_dev_ewanCreateOrConnectWithoutKitInput[]
    createMany?: kit_attribute_cenov_dev_ewanCreateManyKitInputEnvelope
    connect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
  }

  export type part_nc_cenov_dev_ewanCreateNestedManyWithoutKitInput = {
    create?: XOR<part_nc_cenov_dev_ewanCreateWithoutKitInput, part_nc_cenov_dev_ewanUncheckedCreateWithoutKitInput> | part_nc_cenov_dev_ewanCreateWithoutKitInput[] | part_nc_cenov_dev_ewanUncheckedCreateWithoutKitInput[]
    connectOrCreate?: part_nc_cenov_dev_ewanCreateOrConnectWithoutKitInput | part_nc_cenov_dev_ewanCreateOrConnectWithoutKitInput[]
    createMany?: part_nc_cenov_dev_ewanCreateManyKitInputEnvelope
    connect?: part_nc_cenov_dev_ewanWhereUniqueInput | part_nc_cenov_dev_ewanWhereUniqueInput[]
  }

  export type produitUncheckedCreateNestedManyWithoutKitInput = {
    create?: XOR<produitCreateWithoutKitInput, produitUncheckedCreateWithoutKitInput> | produitCreateWithoutKitInput[] | produitUncheckedCreateWithoutKitInput[]
    connectOrCreate?: produitCreateOrConnectWithoutKitInput | produitCreateOrConnectWithoutKitInput[]
    createMany?: produitCreateManyKitInputEnvelope
    connect?: produitWhereUniqueInput | produitWhereUniqueInput[]
  }

  export type kit_attribute_cenov_dev_ewanUncheckedCreateNestedManyWithoutKitInput = {
    create?: XOR<kit_attribute_cenov_dev_ewanCreateWithoutKitInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutKitInput> | kit_attribute_cenov_dev_ewanCreateWithoutKitInput[] | kit_attribute_cenov_dev_ewanUncheckedCreateWithoutKitInput[]
    connectOrCreate?: kit_attribute_cenov_dev_ewanCreateOrConnectWithoutKitInput | kit_attribute_cenov_dev_ewanCreateOrConnectWithoutKitInput[]
    createMany?: kit_attribute_cenov_dev_ewanCreateManyKitInputEnvelope
    connect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
  }

  export type part_nc_cenov_dev_ewanUncheckedCreateNestedManyWithoutKitInput = {
    create?: XOR<part_nc_cenov_dev_ewanCreateWithoutKitInput, part_nc_cenov_dev_ewanUncheckedCreateWithoutKitInput> | part_nc_cenov_dev_ewanCreateWithoutKitInput[] | part_nc_cenov_dev_ewanUncheckedCreateWithoutKitInput[]
    connectOrCreate?: part_nc_cenov_dev_ewanCreateOrConnectWithoutKitInput | part_nc_cenov_dev_ewanCreateOrConnectWithoutKitInput[]
    createMany?: part_nc_cenov_dev_ewanCreateManyKitInputEnvelope
    connect?: part_nc_cenov_dev_ewanWhereUniqueInput | part_nc_cenov_dev_ewanWhereUniqueInput[]
  }

  export type produitUpdateManyWithoutKitNestedInput = {
    create?: XOR<produitCreateWithoutKitInput, produitUncheckedCreateWithoutKitInput> | produitCreateWithoutKitInput[] | produitUncheckedCreateWithoutKitInput[]
    connectOrCreate?: produitCreateOrConnectWithoutKitInput | produitCreateOrConnectWithoutKitInput[]
    upsert?: produitUpsertWithWhereUniqueWithoutKitInput | produitUpsertWithWhereUniqueWithoutKitInput[]
    createMany?: produitCreateManyKitInputEnvelope
    set?: produitWhereUniqueInput | produitWhereUniqueInput[]
    disconnect?: produitWhereUniqueInput | produitWhereUniqueInput[]
    delete?: produitWhereUniqueInput | produitWhereUniqueInput[]
    connect?: produitWhereUniqueInput | produitWhereUniqueInput[]
    update?: produitUpdateWithWhereUniqueWithoutKitInput | produitUpdateWithWhereUniqueWithoutKitInput[]
    updateMany?: produitUpdateManyWithWhereWithoutKitInput | produitUpdateManyWithWhereWithoutKitInput[]
    deleteMany?: produitScalarWhereInput | produitScalarWhereInput[]
  }

  export type kit_attribute_cenov_dev_ewanUpdateManyWithoutKitNestedInput = {
    create?: XOR<kit_attribute_cenov_dev_ewanCreateWithoutKitInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutKitInput> | kit_attribute_cenov_dev_ewanCreateWithoutKitInput[] | kit_attribute_cenov_dev_ewanUncheckedCreateWithoutKitInput[]
    connectOrCreate?: kit_attribute_cenov_dev_ewanCreateOrConnectWithoutKitInput | kit_attribute_cenov_dev_ewanCreateOrConnectWithoutKitInput[]
    upsert?: kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutKitInput | kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutKitInput[]
    createMany?: kit_attribute_cenov_dev_ewanCreateManyKitInputEnvelope
    set?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    delete?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    connect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    update?: kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutKitInput | kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutKitInput[]
    updateMany?: kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutKitInput | kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutKitInput[]
    deleteMany?: kit_attribute_cenov_dev_ewanScalarWhereInput | kit_attribute_cenov_dev_ewanScalarWhereInput[]
  }

  export type part_nc_cenov_dev_ewanUpdateManyWithoutKitNestedInput = {
    create?: XOR<part_nc_cenov_dev_ewanCreateWithoutKitInput, part_nc_cenov_dev_ewanUncheckedCreateWithoutKitInput> | part_nc_cenov_dev_ewanCreateWithoutKitInput[] | part_nc_cenov_dev_ewanUncheckedCreateWithoutKitInput[]
    connectOrCreate?: part_nc_cenov_dev_ewanCreateOrConnectWithoutKitInput | part_nc_cenov_dev_ewanCreateOrConnectWithoutKitInput[]
    upsert?: part_nc_cenov_dev_ewanUpsertWithWhereUniqueWithoutKitInput | part_nc_cenov_dev_ewanUpsertWithWhereUniqueWithoutKitInput[]
    createMany?: part_nc_cenov_dev_ewanCreateManyKitInputEnvelope
    set?: part_nc_cenov_dev_ewanWhereUniqueInput | part_nc_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: part_nc_cenov_dev_ewanWhereUniqueInput | part_nc_cenov_dev_ewanWhereUniqueInput[]
    delete?: part_nc_cenov_dev_ewanWhereUniqueInput | part_nc_cenov_dev_ewanWhereUniqueInput[]
    connect?: part_nc_cenov_dev_ewanWhereUniqueInput | part_nc_cenov_dev_ewanWhereUniqueInput[]
    update?: part_nc_cenov_dev_ewanUpdateWithWhereUniqueWithoutKitInput | part_nc_cenov_dev_ewanUpdateWithWhereUniqueWithoutKitInput[]
    updateMany?: part_nc_cenov_dev_ewanUpdateManyWithWhereWithoutKitInput | part_nc_cenov_dev_ewanUpdateManyWithWhereWithoutKitInput[]
    deleteMany?: part_nc_cenov_dev_ewanScalarWhereInput | part_nc_cenov_dev_ewanScalarWhereInput[]
  }

  export type produitUncheckedUpdateManyWithoutKitNestedInput = {
    create?: XOR<produitCreateWithoutKitInput, produitUncheckedCreateWithoutKitInput> | produitCreateWithoutKitInput[] | produitUncheckedCreateWithoutKitInput[]
    connectOrCreate?: produitCreateOrConnectWithoutKitInput | produitCreateOrConnectWithoutKitInput[]
    upsert?: produitUpsertWithWhereUniqueWithoutKitInput | produitUpsertWithWhereUniqueWithoutKitInput[]
    createMany?: produitCreateManyKitInputEnvelope
    set?: produitWhereUniqueInput | produitWhereUniqueInput[]
    disconnect?: produitWhereUniqueInput | produitWhereUniqueInput[]
    delete?: produitWhereUniqueInput | produitWhereUniqueInput[]
    connect?: produitWhereUniqueInput | produitWhereUniqueInput[]
    update?: produitUpdateWithWhereUniqueWithoutKitInput | produitUpdateWithWhereUniqueWithoutKitInput[]
    updateMany?: produitUpdateManyWithWhereWithoutKitInput | produitUpdateManyWithWhereWithoutKitInput[]
    deleteMany?: produitScalarWhereInput | produitScalarWhereInput[]
  }

  export type kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutKitNestedInput = {
    create?: XOR<kit_attribute_cenov_dev_ewanCreateWithoutKitInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutKitInput> | kit_attribute_cenov_dev_ewanCreateWithoutKitInput[] | kit_attribute_cenov_dev_ewanUncheckedCreateWithoutKitInput[]
    connectOrCreate?: kit_attribute_cenov_dev_ewanCreateOrConnectWithoutKitInput | kit_attribute_cenov_dev_ewanCreateOrConnectWithoutKitInput[]
    upsert?: kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutKitInput | kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutKitInput[]
    createMany?: kit_attribute_cenov_dev_ewanCreateManyKitInputEnvelope
    set?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    delete?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    connect?: kit_attribute_cenov_dev_ewanWhereUniqueInput | kit_attribute_cenov_dev_ewanWhereUniqueInput[]
    update?: kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutKitInput | kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutKitInput[]
    updateMany?: kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutKitInput | kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutKitInput[]
    deleteMany?: kit_attribute_cenov_dev_ewanScalarWhereInput | kit_attribute_cenov_dev_ewanScalarWhereInput[]
  }

  export type part_nc_cenov_dev_ewanUncheckedUpdateManyWithoutKitNestedInput = {
    create?: XOR<part_nc_cenov_dev_ewanCreateWithoutKitInput, part_nc_cenov_dev_ewanUncheckedCreateWithoutKitInput> | part_nc_cenov_dev_ewanCreateWithoutKitInput[] | part_nc_cenov_dev_ewanUncheckedCreateWithoutKitInput[]
    connectOrCreate?: part_nc_cenov_dev_ewanCreateOrConnectWithoutKitInput | part_nc_cenov_dev_ewanCreateOrConnectWithoutKitInput[]
    upsert?: part_nc_cenov_dev_ewanUpsertWithWhereUniqueWithoutKitInput | part_nc_cenov_dev_ewanUpsertWithWhereUniqueWithoutKitInput[]
    createMany?: part_nc_cenov_dev_ewanCreateManyKitInputEnvelope
    set?: part_nc_cenov_dev_ewanWhereUniqueInput | part_nc_cenov_dev_ewanWhereUniqueInput[]
    disconnect?: part_nc_cenov_dev_ewanWhereUniqueInput | part_nc_cenov_dev_ewanWhereUniqueInput[]
    delete?: part_nc_cenov_dev_ewanWhereUniqueInput | part_nc_cenov_dev_ewanWhereUniqueInput[]
    connect?: part_nc_cenov_dev_ewanWhereUniqueInput | part_nc_cenov_dev_ewanWhereUniqueInput[]
    update?: part_nc_cenov_dev_ewanUpdateWithWhereUniqueWithoutKitInput | part_nc_cenov_dev_ewanUpdateWithWhereUniqueWithoutKitInput[]
    updateMany?: part_nc_cenov_dev_ewanUpdateManyWithWhereWithoutKitInput | part_nc_cenov_dev_ewanUpdateManyWithWhereWithoutKitInput[]
    deleteMany?: part_nc_cenov_dev_ewanScalarWhereInput | part_nc_cenov_dev_ewanScalarWhereInput[]
  }

  export type attribut_cenov_dev_ewanCreateNestedOneWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput = {
    create?: XOR<attribut_cenov_dev_ewanCreateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput, attribut_cenov_dev_ewanUncheckedCreateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput>
    connectOrCreate?: attribut_cenov_dev_ewanCreateOrConnectWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput
    connect?: attribut_cenov_dev_ewanWhereUniqueInput
  }

  export type attribut_cenov_dev_ewanCreateNestedOneWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput = {
    create?: XOR<attribut_cenov_dev_ewanCreateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput, attribut_cenov_dev_ewanUncheckedCreateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput>
    connectOrCreate?: attribut_cenov_dev_ewanCreateOrConnectWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput
    connect?: attribut_cenov_dev_ewanWhereUniqueInput
  }

  export type kit_cenov_dev_ewanCreateNestedOneWithoutKit_attributeInput = {
    create?: XOR<kit_cenov_dev_ewanCreateWithoutKit_attributeInput, kit_cenov_dev_ewanUncheckedCreateWithoutKit_attributeInput>
    connectOrCreate?: kit_cenov_dev_ewanCreateOrConnectWithoutKit_attributeInput
    connect?: kit_cenov_dev_ewanWhereUniqueInput
  }

  export type attribut_cenov_dev_ewanUpdateOneWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributNestedInput = {
    create?: XOR<attribut_cenov_dev_ewanCreateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput, attribut_cenov_dev_ewanUncheckedCreateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput>
    connectOrCreate?: attribut_cenov_dev_ewanCreateOrConnectWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput
    upsert?: attribut_cenov_dev_ewanUpsertWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput
    disconnect?: attribut_cenov_dev_ewanWhereInput | boolean
    delete?: attribut_cenov_dev_ewanWhereInput | boolean
    connect?: attribut_cenov_dev_ewanWhereUniqueInput
    update?: XOR<XOR<attribut_cenov_dev_ewanUpdateToOneWithWhereWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput, attribut_cenov_dev_ewanUpdateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput>, attribut_cenov_dev_ewanUncheckedUpdateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput>
  }

  export type attribut_cenov_dev_ewanUpdateOneWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributNestedInput = {
    create?: XOR<attribut_cenov_dev_ewanCreateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput, attribut_cenov_dev_ewanUncheckedCreateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput>
    connectOrCreate?: attribut_cenov_dev_ewanCreateOrConnectWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput
    upsert?: attribut_cenov_dev_ewanUpsertWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput
    disconnect?: attribut_cenov_dev_ewanWhereInput | boolean
    delete?: attribut_cenov_dev_ewanWhereInput | boolean
    connect?: attribut_cenov_dev_ewanWhereUniqueInput
    update?: XOR<XOR<attribut_cenov_dev_ewanUpdateToOneWithWhereWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput, attribut_cenov_dev_ewanUpdateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput>, attribut_cenov_dev_ewanUncheckedUpdateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput>
  }

  export type kit_cenov_dev_ewanUpdateOneWithoutKit_attributeNestedInput = {
    create?: XOR<kit_cenov_dev_ewanCreateWithoutKit_attributeInput, kit_cenov_dev_ewanUncheckedCreateWithoutKit_attributeInput>
    connectOrCreate?: kit_cenov_dev_ewanCreateOrConnectWithoutKit_attributeInput
    upsert?: kit_cenov_dev_ewanUpsertWithoutKit_attributeInput
    disconnect?: kit_cenov_dev_ewanWhereInput | boolean
    delete?: kit_cenov_dev_ewanWhereInput | boolean
    connect?: kit_cenov_dev_ewanWhereUniqueInput
    update?: XOR<XOR<kit_cenov_dev_ewanUpdateToOneWithWhereWithoutKit_attributeInput, kit_cenov_dev_ewanUpdateWithoutKit_attributeInput>, kit_cenov_dev_ewanUncheckedUpdateWithoutKit_attributeInput>
  }

  export type kit_cenov_dev_ewanCreateNestedOneWithoutPart_ncInput = {
    create?: XOR<kit_cenov_dev_ewanCreateWithoutPart_ncInput, kit_cenov_dev_ewanUncheckedCreateWithoutPart_ncInput>
    connectOrCreate?: kit_cenov_dev_ewanCreateOrConnectWithoutPart_ncInput
    connect?: kit_cenov_dev_ewanWhereUniqueInput
  }

  export type kit_cenov_dev_ewanUpdateOneWithoutPart_ncNestedInput = {
    create?: XOR<kit_cenov_dev_ewanCreateWithoutPart_ncInput, kit_cenov_dev_ewanUncheckedCreateWithoutPart_ncInput>
    connectOrCreate?: kit_cenov_dev_ewanCreateOrConnectWithoutPart_ncInput
    upsert?: kit_cenov_dev_ewanUpsertWithoutPart_ncInput
    disconnect?: kit_cenov_dev_ewanWhereInput | boolean
    delete?: kit_cenov_dev_ewanWhereInput | boolean
    connect?: kit_cenov_dev_ewanWhereUniqueInput
    update?: XOR<XOR<kit_cenov_dev_ewanUpdateToOneWithWhereWithoutPart_ncInput, kit_cenov_dev_ewanUpdateWithoutPart_ncInput>, kit_cenov_dev_ewanUncheckedUpdateWithoutPart_ncInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type categorieCreateWithoutOther_categorieInput = {
    cat_code?: string | null
    cat_label?: string | null
    categorie?: categorieCreateNestedOneWithoutOther_categorieInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanCreateNestedManyWithoutCategorieInput
    produit_categorie?: produit_categorie_cenov_dev_ewanCreateNestedManyWithoutCategorieInput
  }

  export type categorieUncheckedCreateWithoutOther_categorieInput = {
    cat_id?: number
    fk_parent?: number | null
    cat_code?: string | null
    cat_label?: string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedCreateNestedManyWithoutCategorieInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedCreateNestedManyWithoutCategorieInput
  }

  export type categorieCreateOrConnectWithoutOther_categorieInput = {
    where: categorieWhereUniqueInput
    create: XOR<categorieCreateWithoutOther_categorieInput, categorieUncheckedCreateWithoutOther_categorieInput>
  }

  export type categorieCreateWithoutCategorieInput = {
    cat_code?: string | null
    cat_label?: string | null
    other_categorie?: categorieCreateNestedManyWithoutCategorieInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanCreateNestedManyWithoutCategorieInput
    produit_categorie?: produit_categorie_cenov_dev_ewanCreateNestedManyWithoutCategorieInput
  }

  export type categorieUncheckedCreateWithoutCategorieInput = {
    cat_id?: number
    cat_code?: string | null
    cat_label?: string | null
    other_categorie?: categorieUncheckedCreateNestedManyWithoutCategorieInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedCreateNestedManyWithoutCategorieInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedCreateNestedManyWithoutCategorieInput
  }

  export type categorieCreateOrConnectWithoutCategorieInput = {
    where: categorieWhereUniqueInput
    create: XOR<categorieCreateWithoutCategorieInput, categorieUncheckedCreateWithoutCategorieInput>
  }

  export type categorieCreateManyCategorieInputEnvelope = {
    data: categorieCreateManyCategorieInput | categorieCreateManyCategorieInput[]
    skipDuplicates?: boolean
  }

  export type categorie_attribut_cenov_dev_ewanCreateWithoutCategorieInput = {
    attribut: attribut_cenov_dev_ewanCreateNestedOneWithoutCategorie_attributInput
  }

  export type categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutCategorieInput = {
    fk_attribute: number
  }

  export type categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutCategorieInput = {
    where: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    create: XOR<categorie_attribut_cenov_dev_ewanCreateWithoutCategorieInput, categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutCategorieInput>
  }

  export type categorie_attribut_cenov_dev_ewanCreateManyCategorieInputEnvelope = {
    data: categorie_attribut_cenov_dev_ewanCreateManyCategorieInput | categorie_attribut_cenov_dev_ewanCreateManyCategorieInput[]
    skipDuplicates?: boolean
  }

  export type produit_categorie_cenov_dev_ewanCreateWithoutCategorieInput = {
    produit: produitCreateNestedOneWithoutProduit_categorieInput
  }

  export type produit_categorie_cenov_dev_ewanUncheckedCreateWithoutCategorieInput = {
    fk_produit: number
  }

  export type produit_categorie_cenov_dev_ewanCreateOrConnectWithoutCategorieInput = {
    where: produit_categorie_cenov_dev_ewanWhereUniqueInput
    create: XOR<produit_categorie_cenov_dev_ewanCreateWithoutCategorieInput, produit_categorie_cenov_dev_ewanUncheckedCreateWithoutCategorieInput>
  }

  export type produit_categorie_cenov_dev_ewanCreateManyCategorieInputEnvelope = {
    data: produit_categorie_cenov_dev_ewanCreateManyCategorieInput | produit_categorie_cenov_dev_ewanCreateManyCategorieInput[]
    skipDuplicates?: boolean
  }

  export type categorieUpsertWithoutOther_categorieInput = {
    update: XOR<categorieUpdateWithoutOther_categorieInput, categorieUncheckedUpdateWithoutOther_categorieInput>
    create: XOR<categorieCreateWithoutOther_categorieInput, categorieUncheckedCreateWithoutOther_categorieInput>
    where?: categorieWhereInput
  }

  export type categorieUpdateToOneWithWhereWithoutOther_categorieInput = {
    where?: categorieWhereInput
    data: XOR<categorieUpdateWithoutOther_categorieInput, categorieUncheckedUpdateWithoutOther_categorieInput>
  }

  export type categorieUpdateWithoutOther_categorieInput = {
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
    categorie?: categorieUpdateOneWithoutOther_categorieNestedInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUpdateManyWithoutCategorieNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUpdateManyWithoutCategorieNestedInput
  }

  export type categorieUncheckedUpdateWithoutOther_categorieInput = {
    cat_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieNestedInput
  }

  export type categorieUpsertWithWhereUniqueWithoutCategorieInput = {
    where: categorieWhereUniqueInput
    update: XOR<categorieUpdateWithoutCategorieInput, categorieUncheckedUpdateWithoutCategorieInput>
    create: XOR<categorieCreateWithoutCategorieInput, categorieUncheckedCreateWithoutCategorieInput>
  }

  export type categorieUpdateWithWhereUniqueWithoutCategorieInput = {
    where: categorieWhereUniqueInput
    data: XOR<categorieUpdateWithoutCategorieInput, categorieUncheckedUpdateWithoutCategorieInput>
  }

  export type categorieUpdateManyWithWhereWithoutCategorieInput = {
    where: categorieScalarWhereInput
    data: XOR<categorieUpdateManyMutationInput, categorieUncheckedUpdateManyWithoutCategorieInput>
  }

  export type categorieScalarWhereInput = {
    AND?: categorieScalarWhereInput | categorieScalarWhereInput[]
    OR?: categorieScalarWhereInput[]
    NOT?: categorieScalarWhereInput | categorieScalarWhereInput[]
    cat_id?: IntFilter<"categorie"> | number
    fk_parent?: IntNullableFilter<"categorie"> | number | null
    cat_code?: StringNullableFilter<"categorie"> | string | null
    cat_label?: StringNullableFilter<"categorie"> | string | null
  }

  export type categorie_attribut_cenov_dev_ewanUpsertWithWhereUniqueWithoutCategorieInput = {
    where: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    update: XOR<categorie_attribut_cenov_dev_ewanUpdateWithoutCategorieInput, categorie_attribut_cenov_dev_ewanUncheckedUpdateWithoutCategorieInput>
    create: XOR<categorie_attribut_cenov_dev_ewanCreateWithoutCategorieInput, categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutCategorieInput>
  }

  export type categorie_attribut_cenov_dev_ewanUpdateWithWhereUniqueWithoutCategorieInput = {
    where: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    data: XOR<categorie_attribut_cenov_dev_ewanUpdateWithoutCategorieInput, categorie_attribut_cenov_dev_ewanUncheckedUpdateWithoutCategorieInput>
  }

  export type categorie_attribut_cenov_dev_ewanUpdateManyWithWhereWithoutCategorieInput = {
    where: categorie_attribut_cenov_dev_ewanScalarWhereInput
    data: XOR<categorie_attribut_cenov_dev_ewanUpdateManyMutationInput, categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieInput>
  }

  export type categorie_attribut_cenov_dev_ewanScalarWhereInput = {
    AND?: categorie_attribut_cenov_dev_ewanScalarWhereInput | categorie_attribut_cenov_dev_ewanScalarWhereInput[]
    OR?: categorie_attribut_cenov_dev_ewanScalarWhereInput[]
    NOT?: categorie_attribut_cenov_dev_ewanScalarWhereInput | categorie_attribut_cenov_dev_ewanScalarWhereInput[]
    fk_categorie?: IntFilter<"categorie_attribut_cenov_dev_ewan"> | number
    fk_attribute?: IntFilter<"categorie_attribut_cenov_dev_ewan"> | number
  }

  export type produit_categorie_cenov_dev_ewanUpsertWithWhereUniqueWithoutCategorieInput = {
    where: produit_categorie_cenov_dev_ewanWhereUniqueInput
    update: XOR<produit_categorie_cenov_dev_ewanUpdateWithoutCategorieInput, produit_categorie_cenov_dev_ewanUncheckedUpdateWithoutCategorieInput>
    create: XOR<produit_categorie_cenov_dev_ewanCreateWithoutCategorieInput, produit_categorie_cenov_dev_ewanUncheckedCreateWithoutCategorieInput>
  }

  export type produit_categorie_cenov_dev_ewanUpdateWithWhereUniqueWithoutCategorieInput = {
    where: produit_categorie_cenov_dev_ewanWhereUniqueInput
    data: XOR<produit_categorie_cenov_dev_ewanUpdateWithoutCategorieInput, produit_categorie_cenov_dev_ewanUncheckedUpdateWithoutCategorieInput>
  }

  export type produit_categorie_cenov_dev_ewanUpdateManyWithWhereWithoutCategorieInput = {
    where: produit_categorie_cenov_dev_ewanScalarWhereInput
    data: XOR<produit_categorie_cenov_dev_ewanUpdateManyMutationInput, produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieInput>
  }

  export type produit_categorie_cenov_dev_ewanScalarWhereInput = {
    AND?: produit_categorie_cenov_dev_ewanScalarWhereInput | produit_categorie_cenov_dev_ewanScalarWhereInput[]
    OR?: produit_categorie_cenov_dev_ewanScalarWhereInput[]
    NOT?: produit_categorie_cenov_dev_ewanScalarWhereInput | produit_categorie_cenov_dev_ewanScalarWhereInput[]
    fk_produit?: IntFilter<"produit_categorie_cenov_dev_ewan"> | number
    fk_categorie?: IntFilter<"produit_categorie_cenov_dev_ewan"> | number
  }

  export type attribut_cenov_dev_ewanCreateWithoutCategorie_attributInput = {
    atr_nat?: string | null
    atr_val?: string | null
    atr_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput
  }

  export type attribut_cenov_dev_ewanUncheckedCreateWithoutCategorie_attributInput = {
    atr_id?: number
    atr_nat?: string | null
    atr_val?: string | null
    atr_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanUncheckedCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanUncheckedCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput
  }

  export type attribut_cenov_dev_ewanCreateOrConnectWithoutCategorie_attributInput = {
    where: attribut_cenov_dev_ewanWhereUniqueInput
    create: XOR<attribut_cenov_dev_ewanCreateWithoutCategorie_attributInput, attribut_cenov_dev_ewanUncheckedCreateWithoutCategorie_attributInput>
  }

  export type categorieCreateWithoutCategorie_attributInput = {
    cat_code?: string | null
    cat_label?: string | null
    categorie?: categorieCreateNestedOneWithoutOther_categorieInput
    other_categorie?: categorieCreateNestedManyWithoutCategorieInput
    produit_categorie?: produit_categorie_cenov_dev_ewanCreateNestedManyWithoutCategorieInput
  }

  export type categorieUncheckedCreateWithoutCategorie_attributInput = {
    cat_id?: number
    fk_parent?: number | null
    cat_code?: string | null
    cat_label?: string | null
    other_categorie?: categorieUncheckedCreateNestedManyWithoutCategorieInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedCreateNestedManyWithoutCategorieInput
  }

  export type categorieCreateOrConnectWithoutCategorie_attributInput = {
    where: categorieWhereUniqueInput
    create: XOR<categorieCreateWithoutCategorie_attributInput, categorieUncheckedCreateWithoutCategorie_attributInput>
  }

  export type attribut_cenov_dev_ewanUpsertWithoutCategorie_attributInput = {
    update: XOR<attribut_cenov_dev_ewanUpdateWithoutCategorie_attributInput, attribut_cenov_dev_ewanUncheckedUpdateWithoutCategorie_attributInput>
    create: XOR<attribut_cenov_dev_ewanCreateWithoutCategorie_attributInput, attribut_cenov_dev_ewanUncheckedCreateWithoutCategorie_attributInput>
    where?: attribut_cenov_dev_ewanWhereInput
  }

  export type attribut_cenov_dev_ewanUpdateToOneWithWhereWithoutCategorie_attributInput = {
    where?: attribut_cenov_dev_ewanWhereInput
    data: XOR<attribut_cenov_dev_ewanUpdateWithoutCategorie_attributInput, attribut_cenov_dev_ewanUncheckedUpdateWithoutCategorie_attributInput>
  }

  export type attribut_cenov_dev_ewanUpdateWithoutCategorie_attributInput = {
    atr_nat?: NullableStringFieldUpdateOperationsInput | string | null
    atr_val?: NullableStringFieldUpdateOperationsInput | string | null
    atr_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanUpdateManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributNestedInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanUpdateManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributNestedInput
  }

  export type attribut_cenov_dev_ewanUncheckedUpdateWithoutCategorie_attributInput = {
    atr_id?: IntFieldUpdateOperationsInput | number
    atr_nat?: NullableStringFieldUpdateOperationsInput | string | null
    atr_val?: NullableStringFieldUpdateOperationsInput | string | null
    atr_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributNestedInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributNestedInput
  }

  export type categorieUpsertWithoutCategorie_attributInput = {
    update: XOR<categorieUpdateWithoutCategorie_attributInput, categorieUncheckedUpdateWithoutCategorie_attributInput>
    create: XOR<categorieCreateWithoutCategorie_attributInput, categorieUncheckedCreateWithoutCategorie_attributInput>
    where?: categorieWhereInput
  }

  export type categorieUpdateToOneWithWhereWithoutCategorie_attributInput = {
    where?: categorieWhereInput
    data: XOR<categorieUpdateWithoutCategorie_attributInput, categorieUncheckedUpdateWithoutCategorie_attributInput>
  }

  export type categorieUpdateWithoutCategorie_attributInput = {
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
    categorie?: categorieUpdateOneWithoutOther_categorieNestedInput
    other_categorie?: categorieUpdateManyWithoutCategorieNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUpdateManyWithoutCategorieNestedInput
  }

  export type categorieUncheckedUpdateWithoutCategorie_attributInput = {
    cat_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
    other_categorie?: categorieUncheckedUpdateManyWithoutCategorieNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieNestedInput
  }

  export type produitCreateWithoutCross_refInput = {
    pro_code?: string | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kit?: kit_cenov_dev_ewanCreateNestedOneWithoutProduitInput
    fournisseur?: fournisseurCreateNestedOneWithoutProduitInput
    produit_categorie?: produit_categorie_cenov_dev_ewanCreateNestedManyWithoutProduitInput
    tarif_achat?: tarif_achat_cenov_dev_ewanCreateNestedManyWithoutProduitInput
  }

  export type produitUncheckedCreateWithoutCross_refInput = {
    pro_id?: number
    pro_code?: string | null
    fk_supplier?: number | null
    fk_kit?: number | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedCreateNestedManyWithoutProduitInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUncheckedCreateNestedManyWithoutProduitInput
  }

  export type produitCreateOrConnectWithoutCross_refInput = {
    where: produitWhereUniqueInput
    create: XOR<produitCreateWithoutCross_refInput, produitUncheckedCreateWithoutCross_refInput>
  }

  export type produitUpsertWithoutCross_refInput = {
    update: XOR<produitUpdateWithoutCross_refInput, produitUncheckedUpdateWithoutCross_refInput>
    create: XOR<produitCreateWithoutCross_refInput, produitUncheckedCreateWithoutCross_refInput>
    where?: produitWhereInput
  }

  export type produitUpdateToOneWithWhereWithoutCross_refInput = {
    where?: produitWhereInput
    data: XOR<produitUpdateWithoutCross_refInput, produitUncheckedUpdateWithoutCross_refInput>
  }

  export type produitUpdateWithoutCross_refInput = {
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kit?: kit_cenov_dev_ewanUpdateOneWithoutProduitNestedInput
    fournisseur?: fournisseurUpdateOneWithoutProduitNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUpdateManyWithoutProduitNestedInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUpdateManyWithoutProduitNestedInput
  }

  export type produitUncheckedUpdateWithoutCross_refInput = {
    pro_id?: IntFieldUpdateOperationsInput | number
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: NullableIntFieldUpdateOperationsInput | number | null
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutProduitNestedInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUncheckedUpdateManyWithoutProduitNestedInput
  }

  export type fournisseurCreateWithoutFamilleInput = {
    frs_code: string
    frs_label?: string | null
    produit?: produitCreateNestedManyWithoutFournisseurInput
  }

  export type fournisseurUncheckedCreateWithoutFamilleInput = {
    frs_id?: number
    frs_code: string
    frs_label?: string | null
    produit?: produitUncheckedCreateNestedManyWithoutFournisseurInput
  }

  export type fournisseurCreateOrConnectWithoutFamilleInput = {
    where: fournisseurWhereUniqueInput
    create: XOR<fournisseurCreateWithoutFamilleInput, fournisseurUncheckedCreateWithoutFamilleInput>
  }

  export type familleCreateWithoutOther_familleInput = {
    fam_code?: string | null
    fam_label?: string | null
    fournisseur: fournisseurCreateNestedOneWithoutFamilleInput
    famille?: familleCreateNestedOneWithoutOther_familleInput
  }

  export type familleUncheckedCreateWithoutOther_familleInput = {
    fam_id?: number
    fk_parent?: number | null
    fam_code?: string | null
    fam_label?: string | null
    fk_supplier: number
  }

  export type familleCreateOrConnectWithoutOther_familleInput = {
    where: familleWhereUniqueInput
    create: XOR<familleCreateWithoutOther_familleInput, familleUncheckedCreateWithoutOther_familleInput>
  }

  export type familleCreateWithoutFamilleInput = {
    fam_code?: string | null
    fam_label?: string | null
    fournisseur: fournisseurCreateNestedOneWithoutFamilleInput
    other_famille?: familleCreateNestedManyWithoutFamilleInput
  }

  export type familleUncheckedCreateWithoutFamilleInput = {
    fam_id?: number
    fam_code?: string | null
    fam_label?: string | null
    fk_supplier: number
    other_famille?: familleUncheckedCreateNestedManyWithoutFamilleInput
  }

  export type familleCreateOrConnectWithoutFamilleInput = {
    where: familleWhereUniqueInput
    create: XOR<familleCreateWithoutFamilleInput, familleUncheckedCreateWithoutFamilleInput>
  }

  export type familleCreateManyFamilleInputEnvelope = {
    data: familleCreateManyFamilleInput | familleCreateManyFamilleInput[]
    skipDuplicates?: boolean
  }

  export type fournisseurUpsertWithoutFamilleInput = {
    update: XOR<fournisseurUpdateWithoutFamilleInput, fournisseurUncheckedUpdateWithoutFamilleInput>
    create: XOR<fournisseurCreateWithoutFamilleInput, fournisseurUncheckedCreateWithoutFamilleInput>
    where?: fournisseurWhereInput
  }

  export type fournisseurUpdateToOneWithWhereWithoutFamilleInput = {
    where?: fournisseurWhereInput
    data: XOR<fournisseurUpdateWithoutFamilleInput, fournisseurUncheckedUpdateWithoutFamilleInput>
  }

  export type fournisseurUpdateWithoutFamilleInput = {
    frs_code?: StringFieldUpdateOperationsInput | string
    frs_label?: NullableStringFieldUpdateOperationsInput | string | null
    produit?: produitUpdateManyWithoutFournisseurNestedInput
  }

  export type fournisseurUncheckedUpdateWithoutFamilleInput = {
    frs_id?: IntFieldUpdateOperationsInput | number
    frs_code?: StringFieldUpdateOperationsInput | string
    frs_label?: NullableStringFieldUpdateOperationsInput | string | null
    produit?: produitUncheckedUpdateManyWithoutFournisseurNestedInput
  }

  export type familleUpsertWithoutOther_familleInput = {
    update: XOR<familleUpdateWithoutOther_familleInput, familleUncheckedUpdateWithoutOther_familleInput>
    create: XOR<familleCreateWithoutOther_familleInput, familleUncheckedCreateWithoutOther_familleInput>
    where?: familleWhereInput
  }

  export type familleUpdateToOneWithWhereWithoutOther_familleInput = {
    where?: familleWhereInput
    data: XOR<familleUpdateWithoutOther_familleInput, familleUncheckedUpdateWithoutOther_familleInput>
  }

  export type familleUpdateWithoutOther_familleInput = {
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    fournisseur?: fournisseurUpdateOneRequiredWithoutFamilleNestedInput
    famille?: familleUpdateOneWithoutOther_familleNestedInput
  }

  export type familleUncheckedUpdateWithoutOther_familleInput = {
    fam_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: IntFieldUpdateOperationsInput | number
  }

  export type familleUpsertWithWhereUniqueWithoutFamilleInput = {
    where: familleWhereUniqueInput
    update: XOR<familleUpdateWithoutFamilleInput, familleUncheckedUpdateWithoutFamilleInput>
    create: XOR<familleCreateWithoutFamilleInput, familleUncheckedCreateWithoutFamilleInput>
  }

  export type familleUpdateWithWhereUniqueWithoutFamilleInput = {
    where: familleWhereUniqueInput
    data: XOR<familleUpdateWithoutFamilleInput, familleUncheckedUpdateWithoutFamilleInput>
  }

  export type familleUpdateManyWithWhereWithoutFamilleInput = {
    where: familleScalarWhereInput
    data: XOR<familleUpdateManyMutationInput, familleUncheckedUpdateManyWithoutFamilleInput>
  }

  export type familleScalarWhereInput = {
    AND?: familleScalarWhereInput | familleScalarWhereInput[]
    OR?: familleScalarWhereInput[]
    NOT?: familleScalarWhereInput | familleScalarWhereInput[]
    fam_id?: IntFilter<"famille"> | number
    fk_parent?: IntNullableFilter<"famille"> | number | null
    fam_code?: StringNullableFilter<"famille"> | string | null
    fam_label?: StringNullableFilter<"famille"> | string | null
    fk_supplier?: IntFilter<"famille"> | number
  }

  export type cross_refCreateWithoutProduitInput = {
    crf_id: number
  }

  export type cross_refUncheckedCreateWithoutProduitInput = {
    crf_id: number
  }

  export type cross_refCreateOrConnectWithoutProduitInput = {
    where: cross_refWhereUniqueInput
    create: XOR<cross_refCreateWithoutProduitInput, cross_refUncheckedCreateWithoutProduitInput>
  }

  export type cross_refCreateManyProduitInputEnvelope = {
    data: cross_refCreateManyProduitInput | cross_refCreateManyProduitInput[]
    skipDuplicates?: boolean
  }

  export type kit_cenov_dev_ewanCreateWithoutProduitInput = {
    kit_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kit_attribute?: kit_attribute_cenov_dev_ewanCreateNestedManyWithoutKitInput
    part_nc?: part_nc_cenov_dev_ewanCreateNestedManyWithoutKitInput
  }

  export type kit_cenov_dev_ewanUncheckedCreateWithoutProduitInput = {
    kit_id?: number
    kit_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kit_attribute?: kit_attribute_cenov_dev_ewanUncheckedCreateNestedManyWithoutKitInput
    part_nc?: part_nc_cenov_dev_ewanUncheckedCreateNestedManyWithoutKitInput
  }

  export type kit_cenov_dev_ewanCreateOrConnectWithoutProduitInput = {
    where: kit_cenov_dev_ewanWhereUniqueInput
    create: XOR<kit_cenov_dev_ewanCreateWithoutProduitInput, kit_cenov_dev_ewanUncheckedCreateWithoutProduitInput>
  }

  export type fournisseurCreateWithoutProduitInput = {
    frs_code: string
    frs_label?: string | null
    famille?: familleCreateNestedManyWithoutFournisseurInput
  }

  export type fournisseurUncheckedCreateWithoutProduitInput = {
    frs_id?: number
    frs_code: string
    frs_label?: string | null
    famille?: familleUncheckedCreateNestedManyWithoutFournisseurInput
  }

  export type fournisseurCreateOrConnectWithoutProduitInput = {
    where: fournisseurWhereUniqueInput
    create: XOR<fournisseurCreateWithoutProduitInput, fournisseurUncheckedCreateWithoutProduitInput>
  }

  export type produit_categorie_cenov_dev_ewanCreateWithoutProduitInput = {
    categorie: categorieCreateNestedOneWithoutProduit_categorieInput
  }

  export type produit_categorie_cenov_dev_ewanUncheckedCreateWithoutProduitInput = {
    fk_categorie: number
  }

  export type produit_categorie_cenov_dev_ewanCreateOrConnectWithoutProduitInput = {
    where: produit_categorie_cenov_dev_ewanWhereUniqueInput
    create: XOR<produit_categorie_cenov_dev_ewanCreateWithoutProduitInput, produit_categorie_cenov_dev_ewanUncheckedCreateWithoutProduitInput>
  }

  export type produit_categorie_cenov_dev_ewanCreateManyProduitInputEnvelope = {
    data: produit_categorie_cenov_dev_ewanCreateManyProduitInput | produit_categorie_cenov_dev_ewanCreateManyProduitInput[]
    skipDuplicates?: boolean
  }

  export type tarif_achat_cenov_dev_ewanCreateWithoutProduitInput = {
    taa_date: Date | string
    taa_montant?: number | null
    taa_remise?: number | null
    taa_montant_net?: number | null
  }

  export type tarif_achat_cenov_dev_ewanUncheckedCreateWithoutProduitInput = {
    taa_date: Date | string
    taa_montant?: number | null
    taa_remise?: number | null
    taa_montant_net?: number | null
  }

  export type tarif_achat_cenov_dev_ewanCreateOrConnectWithoutProduitInput = {
    where: tarif_achat_cenov_dev_ewanWhereUniqueInput
    create: XOR<tarif_achat_cenov_dev_ewanCreateWithoutProduitInput, tarif_achat_cenov_dev_ewanUncheckedCreateWithoutProduitInput>
  }

  export type tarif_achat_cenov_dev_ewanCreateManyProduitInputEnvelope = {
    data: tarif_achat_cenov_dev_ewanCreateManyProduitInput | tarif_achat_cenov_dev_ewanCreateManyProduitInput[]
    skipDuplicates?: boolean
  }

  export type cross_refUpsertWithWhereUniqueWithoutProduitInput = {
    where: cross_refWhereUniqueInput
    update: XOR<cross_refUpdateWithoutProduitInput, cross_refUncheckedUpdateWithoutProduitInput>
    create: XOR<cross_refCreateWithoutProduitInput, cross_refUncheckedCreateWithoutProduitInput>
  }

  export type cross_refUpdateWithWhereUniqueWithoutProduitInput = {
    where: cross_refWhereUniqueInput
    data: XOR<cross_refUpdateWithoutProduitInput, cross_refUncheckedUpdateWithoutProduitInput>
  }

  export type cross_refUpdateManyWithWhereWithoutProduitInput = {
    where: cross_refScalarWhereInput
    data: XOR<cross_refUpdateManyMutationInput, cross_refUncheckedUpdateManyWithoutProduitInput>
  }

  export type cross_refScalarWhereInput = {
    AND?: cross_refScalarWhereInput | cross_refScalarWhereInput[]
    OR?: cross_refScalarWhereInput[]
    NOT?: cross_refScalarWhereInput | cross_refScalarWhereInput[]
    crf_id?: IntFilter<"cross_ref"> | number
    fk_produit?: IntFilter<"cross_ref"> | number
  }

  export type kit_cenov_dev_ewanUpsertWithoutProduitInput = {
    update: XOR<kit_cenov_dev_ewanUpdateWithoutProduitInput, kit_cenov_dev_ewanUncheckedUpdateWithoutProduitInput>
    create: XOR<kit_cenov_dev_ewanCreateWithoutProduitInput, kit_cenov_dev_ewanUncheckedCreateWithoutProduitInput>
    where?: kit_cenov_dev_ewanWhereInput
  }

  export type kit_cenov_dev_ewanUpdateToOneWithWhereWithoutProduitInput = {
    where?: kit_cenov_dev_ewanWhereInput
    data: XOR<kit_cenov_dev_ewanUpdateWithoutProduitInput, kit_cenov_dev_ewanUncheckedUpdateWithoutProduitInput>
  }

  export type kit_cenov_dev_ewanUpdateWithoutProduitInput = {
    kit_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kit_attribute?: kit_attribute_cenov_dev_ewanUpdateManyWithoutKitNestedInput
    part_nc?: part_nc_cenov_dev_ewanUpdateManyWithoutKitNestedInput
  }

  export type kit_cenov_dev_ewanUncheckedUpdateWithoutProduitInput = {
    kit_id?: IntFieldUpdateOperationsInput | number
    kit_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kit_attribute?: kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutKitNestedInput
    part_nc?: part_nc_cenov_dev_ewanUncheckedUpdateManyWithoutKitNestedInput
  }

  export type fournisseurUpsertWithoutProduitInput = {
    update: XOR<fournisseurUpdateWithoutProduitInput, fournisseurUncheckedUpdateWithoutProduitInput>
    create: XOR<fournisseurCreateWithoutProduitInput, fournisseurUncheckedCreateWithoutProduitInput>
    where?: fournisseurWhereInput
  }

  export type fournisseurUpdateToOneWithWhereWithoutProduitInput = {
    where?: fournisseurWhereInput
    data: XOR<fournisseurUpdateWithoutProduitInput, fournisseurUncheckedUpdateWithoutProduitInput>
  }

  export type fournisseurUpdateWithoutProduitInput = {
    frs_code?: StringFieldUpdateOperationsInput | string
    frs_label?: NullableStringFieldUpdateOperationsInput | string | null
    famille?: familleUpdateManyWithoutFournisseurNestedInput
  }

  export type fournisseurUncheckedUpdateWithoutProduitInput = {
    frs_id?: IntFieldUpdateOperationsInput | number
    frs_code?: StringFieldUpdateOperationsInput | string
    frs_label?: NullableStringFieldUpdateOperationsInput | string | null
    famille?: familleUncheckedUpdateManyWithoutFournisseurNestedInput
  }

  export type produit_categorie_cenov_dev_ewanUpsertWithWhereUniqueWithoutProduitInput = {
    where: produit_categorie_cenov_dev_ewanWhereUniqueInput
    update: XOR<produit_categorie_cenov_dev_ewanUpdateWithoutProduitInput, produit_categorie_cenov_dev_ewanUncheckedUpdateWithoutProduitInput>
    create: XOR<produit_categorie_cenov_dev_ewanCreateWithoutProduitInput, produit_categorie_cenov_dev_ewanUncheckedCreateWithoutProduitInput>
  }

  export type produit_categorie_cenov_dev_ewanUpdateWithWhereUniqueWithoutProduitInput = {
    where: produit_categorie_cenov_dev_ewanWhereUniqueInput
    data: XOR<produit_categorie_cenov_dev_ewanUpdateWithoutProduitInput, produit_categorie_cenov_dev_ewanUncheckedUpdateWithoutProduitInput>
  }

  export type produit_categorie_cenov_dev_ewanUpdateManyWithWhereWithoutProduitInput = {
    where: produit_categorie_cenov_dev_ewanScalarWhereInput
    data: XOR<produit_categorie_cenov_dev_ewanUpdateManyMutationInput, produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutProduitInput>
  }

  export type tarif_achat_cenov_dev_ewanUpsertWithWhereUniqueWithoutProduitInput = {
    where: tarif_achat_cenov_dev_ewanWhereUniqueInput
    update: XOR<tarif_achat_cenov_dev_ewanUpdateWithoutProduitInput, tarif_achat_cenov_dev_ewanUncheckedUpdateWithoutProduitInput>
    create: XOR<tarif_achat_cenov_dev_ewanCreateWithoutProduitInput, tarif_achat_cenov_dev_ewanUncheckedCreateWithoutProduitInput>
  }

  export type tarif_achat_cenov_dev_ewanUpdateWithWhereUniqueWithoutProduitInput = {
    where: tarif_achat_cenov_dev_ewanWhereUniqueInput
    data: XOR<tarif_achat_cenov_dev_ewanUpdateWithoutProduitInput, tarif_achat_cenov_dev_ewanUncheckedUpdateWithoutProduitInput>
  }

  export type tarif_achat_cenov_dev_ewanUpdateManyWithWhereWithoutProduitInput = {
    where: tarif_achat_cenov_dev_ewanScalarWhereInput
    data: XOR<tarif_achat_cenov_dev_ewanUpdateManyMutationInput, tarif_achat_cenov_dev_ewanUncheckedUpdateManyWithoutProduitInput>
  }

  export type tarif_achat_cenov_dev_ewanScalarWhereInput = {
    AND?: tarif_achat_cenov_dev_ewanScalarWhereInput | tarif_achat_cenov_dev_ewanScalarWhereInput[]
    OR?: tarif_achat_cenov_dev_ewanScalarWhereInput[]
    NOT?: tarif_achat_cenov_dev_ewanScalarWhereInput | tarif_achat_cenov_dev_ewanScalarWhereInput[]
    fk_produit?: IntFilter<"tarif_achat_cenov_dev_ewan"> | number
    taa_date?: DateTimeFilter<"tarif_achat_cenov_dev_ewan"> | Date | string
    taa_montant?: FloatNullableFilter<"tarif_achat_cenov_dev_ewan"> | number | null
    taa_remise?: FloatNullableFilter<"tarif_achat_cenov_dev_ewan"> | number | null
    taa_montant_net?: FloatNullableFilter<"tarif_achat_cenov_dev_ewan"> | number | null
  }

  export type categorieCreateWithoutProduit_categorieInput = {
    cat_code?: string | null
    cat_label?: string | null
    categorie?: categorieCreateNestedOneWithoutOther_categorieInput
    other_categorie?: categorieCreateNestedManyWithoutCategorieInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanCreateNestedManyWithoutCategorieInput
  }

  export type categorieUncheckedCreateWithoutProduit_categorieInput = {
    cat_id?: number
    fk_parent?: number | null
    cat_code?: string | null
    cat_label?: string | null
    other_categorie?: categorieUncheckedCreateNestedManyWithoutCategorieInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedCreateNestedManyWithoutCategorieInput
  }

  export type categorieCreateOrConnectWithoutProduit_categorieInput = {
    where: categorieWhereUniqueInput
    create: XOR<categorieCreateWithoutProduit_categorieInput, categorieUncheckedCreateWithoutProduit_categorieInput>
  }

  export type produitCreateWithoutProduit_categorieInput = {
    pro_code?: string | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    cross_ref?: cross_refCreateNestedManyWithoutProduitInput
    kit?: kit_cenov_dev_ewanCreateNestedOneWithoutProduitInput
    fournisseur?: fournisseurCreateNestedOneWithoutProduitInput
    tarif_achat?: tarif_achat_cenov_dev_ewanCreateNestedManyWithoutProduitInput
  }

  export type produitUncheckedCreateWithoutProduit_categorieInput = {
    pro_id?: number
    pro_code?: string | null
    fk_supplier?: number | null
    fk_kit?: number | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    cross_ref?: cross_refUncheckedCreateNestedManyWithoutProduitInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUncheckedCreateNestedManyWithoutProduitInput
  }

  export type produitCreateOrConnectWithoutProduit_categorieInput = {
    where: produitWhereUniqueInput
    create: XOR<produitCreateWithoutProduit_categorieInput, produitUncheckedCreateWithoutProduit_categorieInput>
  }

  export type categorieUpsertWithoutProduit_categorieInput = {
    update: XOR<categorieUpdateWithoutProduit_categorieInput, categorieUncheckedUpdateWithoutProduit_categorieInput>
    create: XOR<categorieCreateWithoutProduit_categorieInput, categorieUncheckedCreateWithoutProduit_categorieInput>
    where?: categorieWhereInput
  }

  export type categorieUpdateToOneWithWhereWithoutProduit_categorieInput = {
    where?: categorieWhereInput
    data: XOR<categorieUpdateWithoutProduit_categorieInput, categorieUncheckedUpdateWithoutProduit_categorieInput>
  }

  export type categorieUpdateWithoutProduit_categorieInput = {
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
    categorie?: categorieUpdateOneWithoutOther_categorieNestedInput
    other_categorie?: categorieUpdateManyWithoutCategorieNestedInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUpdateManyWithoutCategorieNestedInput
  }

  export type categorieUncheckedUpdateWithoutProduit_categorieInput = {
    cat_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
    other_categorie?: categorieUncheckedUpdateManyWithoutCategorieNestedInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieNestedInput
  }

  export type produitUpsertWithoutProduit_categorieInput = {
    update: XOR<produitUpdateWithoutProduit_categorieInput, produitUncheckedUpdateWithoutProduit_categorieInput>
    create: XOR<produitCreateWithoutProduit_categorieInput, produitUncheckedCreateWithoutProduit_categorieInput>
    where?: produitWhereInput
  }

  export type produitUpdateToOneWithWhereWithoutProduit_categorieInput = {
    where?: produitWhereInput
    data: XOR<produitUpdateWithoutProduit_categorieInput, produitUncheckedUpdateWithoutProduit_categorieInput>
  }

  export type produitUpdateWithoutProduit_categorieInput = {
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cross_ref?: cross_refUpdateManyWithoutProduitNestedInput
    kit?: kit_cenov_dev_ewanUpdateOneWithoutProduitNestedInput
    fournisseur?: fournisseurUpdateOneWithoutProduitNestedInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUpdateManyWithoutProduitNestedInput
  }

  export type produitUncheckedUpdateWithoutProduit_categorieInput = {
    pro_id?: IntFieldUpdateOperationsInput | number
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: NullableIntFieldUpdateOperationsInput | number | null
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cross_ref?: cross_refUncheckedUpdateManyWithoutProduitNestedInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUncheckedUpdateManyWithoutProduitNestedInput
  }

  export type produitCreateWithoutTarif_achatInput = {
    pro_code?: string | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    cross_ref?: cross_refCreateNestedManyWithoutProduitInput
    kit?: kit_cenov_dev_ewanCreateNestedOneWithoutProduitInput
    fournisseur?: fournisseurCreateNestedOneWithoutProduitInput
    produit_categorie?: produit_categorie_cenov_dev_ewanCreateNestedManyWithoutProduitInput
  }

  export type produitUncheckedCreateWithoutTarif_achatInput = {
    pro_id?: number
    pro_code?: string | null
    fk_supplier?: number | null
    fk_kit?: number | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    cross_ref?: cross_refUncheckedCreateNestedManyWithoutProduitInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedCreateNestedManyWithoutProduitInput
  }

  export type produitCreateOrConnectWithoutTarif_achatInput = {
    where: produitWhereUniqueInput
    create: XOR<produitCreateWithoutTarif_achatInput, produitUncheckedCreateWithoutTarif_achatInput>
  }

  export type produitUpsertWithoutTarif_achatInput = {
    update: XOR<produitUpdateWithoutTarif_achatInput, produitUncheckedUpdateWithoutTarif_achatInput>
    create: XOR<produitCreateWithoutTarif_achatInput, produitUncheckedCreateWithoutTarif_achatInput>
    where?: produitWhereInput
  }

  export type produitUpdateToOneWithWhereWithoutTarif_achatInput = {
    where?: produitWhereInput
    data: XOR<produitUpdateWithoutTarif_achatInput, produitUncheckedUpdateWithoutTarif_achatInput>
  }

  export type produitUpdateWithoutTarif_achatInput = {
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cross_ref?: cross_refUpdateManyWithoutProduitNestedInput
    kit?: kit_cenov_dev_ewanUpdateOneWithoutProduitNestedInput
    fournisseur?: fournisseurUpdateOneWithoutProduitNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUpdateManyWithoutProduitNestedInput
  }

  export type produitUncheckedUpdateWithoutTarif_achatInput = {
    pro_id?: IntFieldUpdateOperationsInput | number
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: NullableIntFieldUpdateOperationsInput | number | null
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cross_ref?: cross_refUncheckedUpdateManyWithoutProduitNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutProduitNestedInput
  }

  export type categorie_attribut_cenov_dev_ewanCreateWithoutAttributInput = {
    categorie: categorieCreateNestedOneWithoutCategorie_attributInput
  }

  export type categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutAttributInput = {
    fk_categorie: number
  }

  export type categorie_attribut_cenov_dev_ewanCreateOrConnectWithoutAttributInput = {
    where: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    create: XOR<categorie_attribut_cenov_dev_ewanCreateWithoutAttributInput, categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutAttributInput>
  }

  export type categorie_attribut_cenov_dev_ewanCreateManyAttributInputEnvelope = {
    data: categorie_attribut_cenov_dev_ewanCreateManyAttributInput | categorie_attribut_cenov_dev_ewanCreateManyAttributInput[]
    skipDuplicates?: boolean
  }

  export type kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput = {
    kat_valeur?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attribut_kit_attribute_fk_attribute_unitToattribut?: attribut_cenov_dev_ewanCreateNestedOneWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput
    kit?: kit_cenov_dev_ewanCreateNestedOneWithoutKit_attributeInput
  }

  export type kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput = {
    fk_kit?: number | null
    fk_attribute_unit?: number | null
    kat_valeur?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kat_id?: number
  }

  export type kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput = {
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
    create: XOR<kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput>
  }

  export type kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_caracToattributInputEnvelope = {
    data: kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_caracToattributInput | kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_caracToattributInput[]
    skipDuplicates?: boolean
  }

  export type kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput = {
    kat_valeur?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attribut_kit_attribute_fk_attribute_caracToattribut?: attribut_cenov_dev_ewanCreateNestedOneWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput
    kit?: kit_cenov_dev_ewanCreateNestedOneWithoutKit_attributeInput
  }

  export type kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput = {
    fk_kit?: number | null
    fk_attribute_carac?: number | null
    kat_valeur?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kat_id?: number
  }

  export type kit_attribute_cenov_dev_ewanCreateOrConnectWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput = {
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
    create: XOR<kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput>
  }

  export type kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_unitToattributInputEnvelope = {
    data: kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_unitToattributInput | kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_unitToattributInput[]
    skipDuplicates?: boolean
  }

  export type categorie_attribut_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttributInput = {
    where: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    update: XOR<categorie_attribut_cenov_dev_ewanUpdateWithoutAttributInput, categorie_attribut_cenov_dev_ewanUncheckedUpdateWithoutAttributInput>
    create: XOR<categorie_attribut_cenov_dev_ewanCreateWithoutAttributInput, categorie_attribut_cenov_dev_ewanUncheckedCreateWithoutAttributInput>
  }

  export type categorie_attribut_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttributInput = {
    where: categorie_attribut_cenov_dev_ewanWhereUniqueInput
    data: XOR<categorie_attribut_cenov_dev_ewanUpdateWithoutAttributInput, categorie_attribut_cenov_dev_ewanUncheckedUpdateWithoutAttributInput>
  }

  export type categorie_attribut_cenov_dev_ewanUpdateManyWithWhereWithoutAttributInput = {
    where: categorie_attribut_cenov_dev_ewanScalarWhereInput
    data: XOR<categorie_attribut_cenov_dev_ewanUpdateManyMutationInput, categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutAttributInput>
  }

  export type kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput = {
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
    update: XOR<kit_attribute_cenov_dev_ewanUpdateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput, kit_attribute_cenov_dev_ewanUncheckedUpdateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput>
    create: XOR<kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput>
  }

  export type kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput = {
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
    data: XOR<kit_attribute_cenov_dev_ewanUpdateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput, kit_attribute_cenov_dev_ewanUncheckedUpdateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput>
  }

  export type kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput = {
    where: kit_attribute_cenov_dev_ewanScalarWhereInput
    data: XOR<kit_attribute_cenov_dev_ewanUpdateManyMutationInput, kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput>
  }

  export type kit_attribute_cenov_dev_ewanScalarWhereInput = {
    AND?: kit_attribute_cenov_dev_ewanScalarWhereInput | kit_attribute_cenov_dev_ewanScalarWhereInput[]
    OR?: kit_attribute_cenov_dev_ewanScalarWhereInput[]
    NOT?: kit_attribute_cenov_dev_ewanScalarWhereInput | kit_attribute_cenov_dev_ewanScalarWhereInput[]
    fk_kit?: IntNullableFilter<"kit_attribute_cenov_dev_ewan"> | number | null
    fk_attribute_carac?: IntNullableFilter<"kit_attribute_cenov_dev_ewan"> | number | null
    fk_attribute_unit?: IntNullableFilter<"kit_attribute_cenov_dev_ewan"> | number | null
    kat_valeur?: StringNullableFilter<"kit_attribute_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableFilter<"kit_attribute_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"kit_attribute_cenov_dev_ewan"> | Date | string | null
    kat_id?: IntFilter<"kit_attribute_cenov_dev_ewan"> | number
  }

  export type kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput = {
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
    update: XOR<kit_attribute_cenov_dev_ewanUpdateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput, kit_attribute_cenov_dev_ewanUncheckedUpdateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput>
    create: XOR<kit_attribute_cenov_dev_ewanCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput>
  }

  export type kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput = {
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
    data: XOR<kit_attribute_cenov_dev_ewanUpdateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput, kit_attribute_cenov_dev_ewanUncheckedUpdateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput>
  }

  export type kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput = {
    where: kit_attribute_cenov_dev_ewanScalarWhereInput
    data: XOR<kit_attribute_cenov_dev_ewanUpdateManyMutationInput, kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput>
  }

  export type familleCreateWithoutFournisseurInput = {
    fam_code?: string | null
    fam_label?: string | null
    famille?: familleCreateNestedOneWithoutOther_familleInput
    other_famille?: familleCreateNestedManyWithoutFamilleInput
  }

  export type familleUncheckedCreateWithoutFournisseurInput = {
    fam_id?: number
    fk_parent?: number | null
    fam_code?: string | null
    fam_label?: string | null
    other_famille?: familleUncheckedCreateNestedManyWithoutFamilleInput
  }

  export type familleCreateOrConnectWithoutFournisseurInput = {
    where: familleWhereUniqueInput
    create: XOR<familleCreateWithoutFournisseurInput, familleUncheckedCreateWithoutFournisseurInput>
  }

  export type familleCreateManyFournisseurInputEnvelope = {
    data: familleCreateManyFournisseurInput | familleCreateManyFournisseurInput[]
    skipDuplicates?: boolean
  }

  export type produitCreateWithoutFournisseurInput = {
    pro_code?: string | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    cross_ref?: cross_refCreateNestedManyWithoutProduitInput
    kit?: kit_cenov_dev_ewanCreateNestedOneWithoutProduitInput
    produit_categorie?: produit_categorie_cenov_dev_ewanCreateNestedManyWithoutProduitInput
    tarif_achat?: tarif_achat_cenov_dev_ewanCreateNestedManyWithoutProduitInput
  }

  export type produitUncheckedCreateWithoutFournisseurInput = {
    pro_id?: number
    pro_code?: string | null
    fk_kit?: number | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    cross_ref?: cross_refUncheckedCreateNestedManyWithoutProduitInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedCreateNestedManyWithoutProduitInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUncheckedCreateNestedManyWithoutProduitInput
  }

  export type produitCreateOrConnectWithoutFournisseurInput = {
    where: produitWhereUniqueInput
    create: XOR<produitCreateWithoutFournisseurInput, produitUncheckedCreateWithoutFournisseurInput>
  }

  export type produitCreateManyFournisseurInputEnvelope = {
    data: produitCreateManyFournisseurInput | produitCreateManyFournisseurInput[]
    skipDuplicates?: boolean
  }

  export type familleUpsertWithWhereUniqueWithoutFournisseurInput = {
    where: familleWhereUniqueInput
    update: XOR<familleUpdateWithoutFournisseurInput, familleUncheckedUpdateWithoutFournisseurInput>
    create: XOR<familleCreateWithoutFournisseurInput, familleUncheckedCreateWithoutFournisseurInput>
  }

  export type familleUpdateWithWhereUniqueWithoutFournisseurInput = {
    where: familleWhereUniqueInput
    data: XOR<familleUpdateWithoutFournisseurInput, familleUncheckedUpdateWithoutFournisseurInput>
  }

  export type familleUpdateManyWithWhereWithoutFournisseurInput = {
    where: familleScalarWhereInput
    data: XOR<familleUpdateManyMutationInput, familleUncheckedUpdateManyWithoutFournisseurInput>
  }

  export type produitUpsertWithWhereUniqueWithoutFournisseurInput = {
    where: produitWhereUniqueInput
    update: XOR<produitUpdateWithoutFournisseurInput, produitUncheckedUpdateWithoutFournisseurInput>
    create: XOR<produitCreateWithoutFournisseurInput, produitUncheckedCreateWithoutFournisseurInput>
  }

  export type produitUpdateWithWhereUniqueWithoutFournisseurInput = {
    where: produitWhereUniqueInput
    data: XOR<produitUpdateWithoutFournisseurInput, produitUncheckedUpdateWithoutFournisseurInput>
  }

  export type produitUpdateManyWithWhereWithoutFournisseurInput = {
    where: produitScalarWhereInput
    data: XOR<produitUpdateManyMutationInput, produitUncheckedUpdateManyWithoutFournisseurInput>
  }

  export type produitScalarWhereInput = {
    AND?: produitScalarWhereInput | produitScalarWhereInput[]
    OR?: produitScalarWhereInput[]
    NOT?: produitScalarWhereInput | produitScalarWhereInput[]
    pro_id?: IntFilter<"produit"> | number
    pro_code?: StringNullableFilter<"produit"> | string | null
    fk_supplier?: IntNullableFilter<"produit"> | number | null
    fk_kit?: IntNullableFilter<"produit"> | number | null
    fk_famille?: IntNullableFilter<"produit"> | number | null
    fk_sfamille?: IntNullableFilter<"produit"> | number | null
    fk_ssfamille?: IntNullableFilter<"produit"> | number | null
    created_at?: DateTimeNullableFilter<"produit"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"produit"> | Date | string | null
  }

  export type produitCreateWithoutKitInput = {
    pro_code?: string | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    cross_ref?: cross_refCreateNestedManyWithoutProduitInput
    fournisseur?: fournisseurCreateNestedOneWithoutProduitInput
    produit_categorie?: produit_categorie_cenov_dev_ewanCreateNestedManyWithoutProduitInput
    tarif_achat?: tarif_achat_cenov_dev_ewanCreateNestedManyWithoutProduitInput
  }

  export type produitUncheckedCreateWithoutKitInput = {
    pro_id?: number
    pro_code?: string | null
    fk_supplier?: number | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    cross_ref?: cross_refUncheckedCreateNestedManyWithoutProduitInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedCreateNestedManyWithoutProduitInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUncheckedCreateNestedManyWithoutProduitInput
  }

  export type produitCreateOrConnectWithoutKitInput = {
    where: produitWhereUniqueInput
    create: XOR<produitCreateWithoutKitInput, produitUncheckedCreateWithoutKitInput>
  }

  export type produitCreateManyKitInputEnvelope = {
    data: produitCreateManyKitInput | produitCreateManyKitInput[]
    skipDuplicates?: boolean
  }

  export type kit_attribute_cenov_dev_ewanCreateWithoutKitInput = {
    kat_valeur?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    attribut_kit_attribute_fk_attribute_caracToattribut?: attribut_cenov_dev_ewanCreateNestedOneWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput
    attribut_kit_attribute_fk_attribute_unitToattribut?: attribut_cenov_dev_ewanCreateNestedOneWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput
  }

  export type kit_attribute_cenov_dev_ewanUncheckedCreateWithoutKitInput = {
    fk_attribute_carac?: number | null
    fk_attribute_unit?: number | null
    kat_valeur?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kat_id?: number
  }

  export type kit_attribute_cenov_dev_ewanCreateOrConnectWithoutKitInput = {
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
    create: XOR<kit_attribute_cenov_dev_ewanCreateWithoutKitInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutKitInput>
  }

  export type kit_attribute_cenov_dev_ewanCreateManyKitInputEnvelope = {
    data: kit_attribute_cenov_dev_ewanCreateManyKitInput | kit_attribute_cenov_dev_ewanCreateManyKitInput[]
    skipDuplicates?: boolean
  }

  export type part_nc_cenov_dev_ewanCreateWithoutKitInput = {
    par_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type part_nc_cenov_dev_ewanUncheckedCreateWithoutKitInput = {
    par_id?: number
    par_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type part_nc_cenov_dev_ewanCreateOrConnectWithoutKitInput = {
    where: part_nc_cenov_dev_ewanWhereUniqueInput
    create: XOR<part_nc_cenov_dev_ewanCreateWithoutKitInput, part_nc_cenov_dev_ewanUncheckedCreateWithoutKitInput>
  }

  export type part_nc_cenov_dev_ewanCreateManyKitInputEnvelope = {
    data: part_nc_cenov_dev_ewanCreateManyKitInput | part_nc_cenov_dev_ewanCreateManyKitInput[]
    skipDuplicates?: boolean
  }

  export type produitUpsertWithWhereUniqueWithoutKitInput = {
    where: produitWhereUniqueInput
    update: XOR<produitUpdateWithoutKitInput, produitUncheckedUpdateWithoutKitInput>
    create: XOR<produitCreateWithoutKitInput, produitUncheckedCreateWithoutKitInput>
  }

  export type produitUpdateWithWhereUniqueWithoutKitInput = {
    where: produitWhereUniqueInput
    data: XOR<produitUpdateWithoutKitInput, produitUncheckedUpdateWithoutKitInput>
  }

  export type produitUpdateManyWithWhereWithoutKitInput = {
    where: produitScalarWhereInput
    data: XOR<produitUpdateManyMutationInput, produitUncheckedUpdateManyWithoutKitInput>
  }

  export type kit_attribute_cenov_dev_ewanUpsertWithWhereUniqueWithoutKitInput = {
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
    update: XOR<kit_attribute_cenov_dev_ewanUpdateWithoutKitInput, kit_attribute_cenov_dev_ewanUncheckedUpdateWithoutKitInput>
    create: XOR<kit_attribute_cenov_dev_ewanCreateWithoutKitInput, kit_attribute_cenov_dev_ewanUncheckedCreateWithoutKitInput>
  }

  export type kit_attribute_cenov_dev_ewanUpdateWithWhereUniqueWithoutKitInput = {
    where: kit_attribute_cenov_dev_ewanWhereUniqueInput
    data: XOR<kit_attribute_cenov_dev_ewanUpdateWithoutKitInput, kit_attribute_cenov_dev_ewanUncheckedUpdateWithoutKitInput>
  }

  export type kit_attribute_cenov_dev_ewanUpdateManyWithWhereWithoutKitInput = {
    where: kit_attribute_cenov_dev_ewanScalarWhereInput
    data: XOR<kit_attribute_cenov_dev_ewanUpdateManyMutationInput, kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutKitInput>
  }

  export type part_nc_cenov_dev_ewanUpsertWithWhereUniqueWithoutKitInput = {
    where: part_nc_cenov_dev_ewanWhereUniqueInput
    update: XOR<part_nc_cenov_dev_ewanUpdateWithoutKitInput, part_nc_cenov_dev_ewanUncheckedUpdateWithoutKitInput>
    create: XOR<part_nc_cenov_dev_ewanCreateWithoutKitInput, part_nc_cenov_dev_ewanUncheckedCreateWithoutKitInput>
  }

  export type part_nc_cenov_dev_ewanUpdateWithWhereUniqueWithoutKitInput = {
    where: part_nc_cenov_dev_ewanWhereUniqueInput
    data: XOR<part_nc_cenov_dev_ewanUpdateWithoutKitInput, part_nc_cenov_dev_ewanUncheckedUpdateWithoutKitInput>
  }

  export type part_nc_cenov_dev_ewanUpdateManyWithWhereWithoutKitInput = {
    where: part_nc_cenov_dev_ewanScalarWhereInput
    data: XOR<part_nc_cenov_dev_ewanUpdateManyMutationInput, part_nc_cenov_dev_ewanUncheckedUpdateManyWithoutKitInput>
  }

  export type part_nc_cenov_dev_ewanScalarWhereInput = {
    AND?: part_nc_cenov_dev_ewanScalarWhereInput | part_nc_cenov_dev_ewanScalarWhereInput[]
    OR?: part_nc_cenov_dev_ewanScalarWhereInput[]
    NOT?: part_nc_cenov_dev_ewanScalarWhereInput | part_nc_cenov_dev_ewanScalarWhereInput[]
    par_id?: IntFilter<"part_nc_cenov_dev_ewan"> | number
    fk_kit?: IntNullableFilter<"part_nc_cenov_dev_ewan"> | number | null
    par_label?: StringNullableFilter<"part_nc_cenov_dev_ewan"> | string | null
    created_at?: DateTimeNullableFilter<"part_nc_cenov_dev_ewan"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"part_nc_cenov_dev_ewan"> | Date | string | null
  }

  export type attribut_cenov_dev_ewanCreateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput = {
    atr_nat?: string | null
    atr_val?: string | null
    atr_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanCreateNestedManyWithoutAttributInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput
  }

  export type attribut_cenov_dev_ewanUncheckedCreateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput = {
    atr_id?: number
    atr_nat?: string | null
    atr_val?: string | null
    atr_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedCreateNestedManyWithoutAttributInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanUncheckedCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput
  }

  export type attribut_cenov_dev_ewanCreateOrConnectWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput = {
    where: attribut_cenov_dev_ewanWhereUniqueInput
    create: XOR<attribut_cenov_dev_ewanCreateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput, attribut_cenov_dev_ewanUncheckedCreateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput>
  }

  export type attribut_cenov_dev_ewanCreateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput = {
    atr_nat?: string | null
    atr_val?: string | null
    atr_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanCreateNestedManyWithoutAttributInput
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput
  }

  export type attribut_cenov_dev_ewanUncheckedCreateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput = {
    atr_id?: number
    atr_nat?: string | null
    atr_val?: string | null
    atr_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedCreateNestedManyWithoutAttributInput
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanUncheckedCreateNestedManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput
  }

  export type attribut_cenov_dev_ewanCreateOrConnectWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput = {
    where: attribut_cenov_dev_ewanWhereUniqueInput
    create: XOR<attribut_cenov_dev_ewanCreateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput, attribut_cenov_dev_ewanUncheckedCreateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput>
  }

  export type kit_cenov_dev_ewanCreateWithoutKit_attributeInput = {
    kit_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    produit?: produitCreateNestedManyWithoutKitInput
    part_nc?: part_nc_cenov_dev_ewanCreateNestedManyWithoutKitInput
  }

  export type kit_cenov_dev_ewanUncheckedCreateWithoutKit_attributeInput = {
    kit_id?: number
    kit_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    produit?: produitUncheckedCreateNestedManyWithoutKitInput
    part_nc?: part_nc_cenov_dev_ewanUncheckedCreateNestedManyWithoutKitInput
  }

  export type kit_cenov_dev_ewanCreateOrConnectWithoutKit_attributeInput = {
    where: kit_cenov_dev_ewanWhereUniqueInput
    create: XOR<kit_cenov_dev_ewanCreateWithoutKit_attributeInput, kit_cenov_dev_ewanUncheckedCreateWithoutKit_attributeInput>
  }

  export type attribut_cenov_dev_ewanUpsertWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput = {
    update: XOR<attribut_cenov_dev_ewanUpdateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput, attribut_cenov_dev_ewanUncheckedUpdateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput>
    create: XOR<attribut_cenov_dev_ewanCreateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput, attribut_cenov_dev_ewanUncheckedCreateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput>
    where?: attribut_cenov_dev_ewanWhereInput
  }

  export type attribut_cenov_dev_ewanUpdateToOneWithWhereWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput = {
    where?: attribut_cenov_dev_ewanWhereInput
    data: XOR<attribut_cenov_dev_ewanUpdateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput, attribut_cenov_dev_ewanUncheckedUpdateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput>
  }

  export type attribut_cenov_dev_ewanUpdateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput = {
    atr_nat?: NullableStringFieldUpdateOperationsInput | string | null
    atr_val?: NullableStringFieldUpdateOperationsInput | string | null
    atr_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUpdateManyWithoutAttributNestedInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanUpdateManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributNestedInput
  }

  export type attribut_cenov_dev_ewanUncheckedUpdateWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributInput = {
    atr_id?: IntFieldUpdateOperationsInput | number
    atr_nat?: NullableStringFieldUpdateOperationsInput | string | null
    atr_val?: NullableStringFieldUpdateOperationsInput | string | null
    atr_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutAttributNestedInput
    kit_attribute_kit_attribute_fk_attribute_unitToattribut?: kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributNestedInput
  }

  export type attribut_cenov_dev_ewanUpsertWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput = {
    update: XOR<attribut_cenov_dev_ewanUpdateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput, attribut_cenov_dev_ewanUncheckedUpdateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput>
    create: XOR<attribut_cenov_dev_ewanCreateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput, attribut_cenov_dev_ewanUncheckedCreateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput>
    where?: attribut_cenov_dev_ewanWhereInput
  }

  export type attribut_cenov_dev_ewanUpdateToOneWithWhereWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput = {
    where?: attribut_cenov_dev_ewanWhereInput
    data: XOR<attribut_cenov_dev_ewanUpdateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput, attribut_cenov_dev_ewanUncheckedUpdateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput>
  }

  export type attribut_cenov_dev_ewanUpdateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput = {
    atr_nat?: NullableStringFieldUpdateOperationsInput | string | null
    atr_val?: NullableStringFieldUpdateOperationsInput | string | null
    atr_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUpdateManyWithoutAttributNestedInput
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanUpdateManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributNestedInput
  }

  export type attribut_cenov_dev_ewanUncheckedUpdateWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributInput = {
    atr_id?: IntFieldUpdateOperationsInput | number
    atr_nat?: NullableStringFieldUpdateOperationsInput | string | null
    atr_val?: NullableStringFieldUpdateOperationsInput | string | null
    atr_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutAttributNestedInput
    kit_attribute_kit_attribute_fk_attribute_caracToattribut?: kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributNestedInput
  }

  export type kit_cenov_dev_ewanUpsertWithoutKit_attributeInput = {
    update: XOR<kit_cenov_dev_ewanUpdateWithoutKit_attributeInput, kit_cenov_dev_ewanUncheckedUpdateWithoutKit_attributeInput>
    create: XOR<kit_cenov_dev_ewanCreateWithoutKit_attributeInput, kit_cenov_dev_ewanUncheckedCreateWithoutKit_attributeInput>
    where?: kit_cenov_dev_ewanWhereInput
  }

  export type kit_cenov_dev_ewanUpdateToOneWithWhereWithoutKit_attributeInput = {
    where?: kit_cenov_dev_ewanWhereInput
    data: XOR<kit_cenov_dev_ewanUpdateWithoutKit_attributeInput, kit_cenov_dev_ewanUncheckedUpdateWithoutKit_attributeInput>
  }

  export type kit_cenov_dev_ewanUpdateWithoutKit_attributeInput = {
    kit_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    produit?: produitUpdateManyWithoutKitNestedInput
    part_nc?: part_nc_cenov_dev_ewanUpdateManyWithoutKitNestedInput
  }

  export type kit_cenov_dev_ewanUncheckedUpdateWithoutKit_attributeInput = {
    kit_id?: IntFieldUpdateOperationsInput | number
    kit_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    produit?: produitUncheckedUpdateManyWithoutKitNestedInput
    part_nc?: part_nc_cenov_dev_ewanUncheckedUpdateManyWithoutKitNestedInput
  }

  export type kit_cenov_dev_ewanCreateWithoutPart_ncInput = {
    kit_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    produit?: produitCreateNestedManyWithoutKitInput
    kit_attribute?: kit_attribute_cenov_dev_ewanCreateNestedManyWithoutKitInput
  }

  export type kit_cenov_dev_ewanUncheckedCreateWithoutPart_ncInput = {
    kit_id?: number
    kit_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    produit?: produitUncheckedCreateNestedManyWithoutKitInput
    kit_attribute?: kit_attribute_cenov_dev_ewanUncheckedCreateNestedManyWithoutKitInput
  }

  export type kit_cenov_dev_ewanCreateOrConnectWithoutPart_ncInput = {
    where: kit_cenov_dev_ewanWhereUniqueInput
    create: XOR<kit_cenov_dev_ewanCreateWithoutPart_ncInput, kit_cenov_dev_ewanUncheckedCreateWithoutPart_ncInput>
  }

  export type kit_cenov_dev_ewanUpsertWithoutPart_ncInput = {
    update: XOR<kit_cenov_dev_ewanUpdateWithoutPart_ncInput, kit_cenov_dev_ewanUncheckedUpdateWithoutPart_ncInput>
    create: XOR<kit_cenov_dev_ewanCreateWithoutPart_ncInput, kit_cenov_dev_ewanUncheckedCreateWithoutPart_ncInput>
    where?: kit_cenov_dev_ewanWhereInput
  }

  export type kit_cenov_dev_ewanUpdateToOneWithWhereWithoutPart_ncInput = {
    where?: kit_cenov_dev_ewanWhereInput
    data: XOR<kit_cenov_dev_ewanUpdateWithoutPart_ncInput, kit_cenov_dev_ewanUncheckedUpdateWithoutPart_ncInput>
  }

  export type kit_cenov_dev_ewanUpdateWithoutPart_ncInput = {
    kit_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    produit?: produitUpdateManyWithoutKitNestedInput
    kit_attribute?: kit_attribute_cenov_dev_ewanUpdateManyWithoutKitNestedInput
  }

  export type kit_cenov_dev_ewanUncheckedUpdateWithoutPart_ncInput = {
    kit_id?: IntFieldUpdateOperationsInput | number
    kit_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    produit?: produitUncheckedUpdateManyWithoutKitNestedInput
    kit_attribute?: kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutKitNestedInput
  }

  export type categorieCreateManyCategorieInput = {
    cat_id?: number
    cat_code?: string | null
    cat_label?: string | null
  }

  export type categorie_attribut_cenov_dev_ewanCreateManyCategorieInput = {
    fk_attribute: number
  }

  export type produit_categorie_cenov_dev_ewanCreateManyCategorieInput = {
    fk_produit: number
  }

  export type categorieUpdateWithoutCategorieInput = {
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
    other_categorie?: categorieUpdateManyWithoutCategorieNestedInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUpdateManyWithoutCategorieNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUpdateManyWithoutCategorieNestedInput
  }

  export type categorieUncheckedUpdateWithoutCategorieInput = {
    cat_id?: IntFieldUpdateOperationsInput | number
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
    other_categorie?: categorieUncheckedUpdateManyWithoutCategorieNestedInput
    categorie_attribut?: categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieNestedInput
  }

  export type categorieUncheckedUpdateManyWithoutCategorieInput = {
    cat_id?: IntFieldUpdateOperationsInput | number
    cat_code?: NullableStringFieldUpdateOperationsInput | string | null
    cat_label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type categorie_attribut_cenov_dev_ewanUpdateWithoutCategorieInput = {
    attribut?: attribut_cenov_dev_ewanUpdateOneRequiredWithoutCategorie_attributNestedInput
  }

  export type categorie_attribut_cenov_dev_ewanUncheckedUpdateWithoutCategorieInput = {
    fk_attribute?: IntFieldUpdateOperationsInput | number
  }

  export type categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieInput = {
    fk_attribute?: IntFieldUpdateOperationsInput | number
  }

  export type produit_categorie_cenov_dev_ewanUpdateWithoutCategorieInput = {
    produit?: produitUpdateOneRequiredWithoutProduit_categorieNestedInput
  }

  export type produit_categorie_cenov_dev_ewanUncheckedUpdateWithoutCategorieInput = {
    fk_produit?: IntFieldUpdateOperationsInput | number
  }

  export type produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutCategorieInput = {
    fk_produit?: IntFieldUpdateOperationsInput | number
  }

  export type familleCreateManyFamilleInput = {
    fam_id?: number
    fam_code?: string | null
    fam_label?: string | null
    fk_supplier: number
  }

  export type familleUpdateWithoutFamilleInput = {
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    fournisseur?: fournisseurUpdateOneRequiredWithoutFamilleNestedInput
    other_famille?: familleUpdateManyWithoutFamilleNestedInput
  }

  export type familleUncheckedUpdateWithoutFamilleInput = {
    fam_id?: IntFieldUpdateOperationsInput | number
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: IntFieldUpdateOperationsInput | number
    other_famille?: familleUncheckedUpdateManyWithoutFamilleNestedInput
  }

  export type familleUncheckedUpdateManyWithoutFamilleInput = {
    fam_id?: IntFieldUpdateOperationsInput | number
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: IntFieldUpdateOperationsInput | number
  }

  export type cross_refCreateManyProduitInput = {
    crf_id: number
  }

  export type produit_categorie_cenov_dev_ewanCreateManyProduitInput = {
    fk_categorie: number
  }

  export type tarif_achat_cenov_dev_ewanCreateManyProduitInput = {
    taa_date: Date | string
    taa_montant?: number | null
    taa_remise?: number | null
    taa_montant_net?: number | null
  }

  export type cross_refUpdateWithoutProduitInput = {
    crf_id?: IntFieldUpdateOperationsInput | number
  }

  export type cross_refUncheckedUpdateWithoutProduitInput = {
    crf_id?: IntFieldUpdateOperationsInput | number
  }

  export type cross_refUncheckedUpdateManyWithoutProduitInput = {
    crf_id?: IntFieldUpdateOperationsInput | number
  }

  export type produit_categorie_cenov_dev_ewanUpdateWithoutProduitInput = {
    categorie?: categorieUpdateOneRequiredWithoutProduit_categorieNestedInput
  }

  export type produit_categorie_cenov_dev_ewanUncheckedUpdateWithoutProduitInput = {
    fk_categorie?: IntFieldUpdateOperationsInput | number
  }

  export type produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutProduitInput = {
    fk_categorie?: IntFieldUpdateOperationsInput | number
  }

  export type tarif_achat_cenov_dev_ewanUpdateWithoutProduitInput = {
    taa_date?: DateTimeFieldUpdateOperationsInput | Date | string
    taa_montant?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_remise?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_montant_net?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type tarif_achat_cenov_dev_ewanUncheckedUpdateWithoutProduitInput = {
    taa_date?: DateTimeFieldUpdateOperationsInput | Date | string
    taa_montant?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_remise?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_montant_net?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type tarif_achat_cenov_dev_ewanUncheckedUpdateManyWithoutProduitInput = {
    taa_date?: DateTimeFieldUpdateOperationsInput | Date | string
    taa_montant?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_remise?: NullableFloatFieldUpdateOperationsInput | number | null
    taa_montant_net?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type categorie_attribut_cenov_dev_ewanCreateManyAttributInput = {
    fk_categorie: number
  }

  export type kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_caracToattributInput = {
    fk_kit?: number | null
    fk_attribute_unit?: number | null
    kat_valeur?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kat_id?: number
  }

  export type kit_attribute_cenov_dev_ewanCreateManyAttribut_kit_attribute_fk_attribute_unitToattributInput = {
    fk_kit?: number | null
    fk_attribute_carac?: number | null
    kat_valeur?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kat_id?: number
  }

  export type categorie_attribut_cenov_dev_ewanUpdateWithoutAttributInput = {
    categorie?: categorieUpdateOneRequiredWithoutCategorie_attributNestedInput
  }

  export type categorie_attribut_cenov_dev_ewanUncheckedUpdateWithoutAttributInput = {
    fk_categorie?: IntFieldUpdateOperationsInput | number
  }

  export type categorie_attribut_cenov_dev_ewanUncheckedUpdateManyWithoutAttributInput = {
    fk_categorie?: IntFieldUpdateOperationsInput | number
  }

  export type kit_attribute_cenov_dev_ewanUpdateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput = {
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attribut_kit_attribute_fk_attribute_unitToattribut?: attribut_cenov_dev_ewanUpdateOneWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributNestedInput
    kit?: kit_cenov_dev_ewanUpdateOneWithoutKit_attributeNestedInput
  }

  export type kit_attribute_cenov_dev_ewanUncheckedUpdateWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput = {
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_attribute_unit?: NullableIntFieldUpdateOperationsInput | number | null
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kat_id?: IntFieldUpdateOperationsInput | number
  }

  export type kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutAttribut_kit_attribute_fk_attribute_caracToattributInput = {
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_attribute_unit?: NullableIntFieldUpdateOperationsInput | number | null
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kat_id?: IntFieldUpdateOperationsInput | number
  }

  export type kit_attribute_cenov_dev_ewanUpdateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput = {
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attribut_kit_attribute_fk_attribute_caracToattribut?: attribut_cenov_dev_ewanUpdateOneWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributNestedInput
    kit?: kit_cenov_dev_ewanUpdateOneWithoutKit_attributeNestedInput
  }

  export type kit_attribute_cenov_dev_ewanUncheckedUpdateWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput = {
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_attribute_carac?: NullableIntFieldUpdateOperationsInput | number | null
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kat_id?: IntFieldUpdateOperationsInput | number
  }

  export type kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutAttribut_kit_attribute_fk_attribute_unitToattributInput = {
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_attribute_carac?: NullableIntFieldUpdateOperationsInput | number | null
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kat_id?: IntFieldUpdateOperationsInput | number
  }

  export type familleCreateManyFournisseurInput = {
    fam_id?: number
    fk_parent?: number | null
    fam_code?: string | null
    fam_label?: string | null
  }

  export type produitCreateManyFournisseurInput = {
    pro_id?: number
    pro_code?: string | null
    fk_kit?: number | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type familleUpdateWithoutFournisseurInput = {
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    famille?: familleUpdateOneWithoutOther_familleNestedInput
    other_famille?: familleUpdateManyWithoutFamilleNestedInput
  }

  export type familleUncheckedUpdateWithoutFournisseurInput = {
    fam_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
    other_famille?: familleUncheckedUpdateManyWithoutFamilleNestedInput
  }

  export type familleUncheckedUpdateManyWithoutFournisseurInput = {
    fam_id?: IntFieldUpdateOperationsInput | number
    fk_parent?: NullableIntFieldUpdateOperationsInput | number | null
    fam_code?: NullableStringFieldUpdateOperationsInput | string | null
    fam_label?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type produitUpdateWithoutFournisseurInput = {
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cross_ref?: cross_refUpdateManyWithoutProduitNestedInput
    kit?: kit_cenov_dev_ewanUpdateOneWithoutProduitNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUpdateManyWithoutProduitNestedInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUpdateManyWithoutProduitNestedInput
  }

  export type produitUncheckedUpdateWithoutFournisseurInput = {
    pro_id?: IntFieldUpdateOperationsInput | number
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cross_ref?: cross_refUncheckedUpdateManyWithoutProduitNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutProduitNestedInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUncheckedUpdateManyWithoutProduitNestedInput
  }

  export type produitUncheckedUpdateManyWithoutFournisseurInput = {
    pro_id?: IntFieldUpdateOperationsInput | number
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_kit?: NullableIntFieldUpdateOperationsInput | number | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type produitCreateManyKitInput = {
    pro_id?: number
    pro_code?: string | null
    fk_supplier?: number | null
    fk_famille?: number | null
    fk_sfamille?: number | null
    fk_ssfamille?: number | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type kit_attribute_cenov_dev_ewanCreateManyKitInput = {
    fk_attribute_carac?: number | null
    fk_attribute_unit?: number | null
    kat_valeur?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    kat_id?: number
  }

  export type part_nc_cenov_dev_ewanCreateManyKitInput = {
    par_id?: number
    par_label?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
  }

  export type produitUpdateWithoutKitInput = {
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cross_ref?: cross_refUpdateManyWithoutProduitNestedInput
    fournisseur?: fournisseurUpdateOneWithoutProduitNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUpdateManyWithoutProduitNestedInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUpdateManyWithoutProduitNestedInput
  }

  export type produitUncheckedUpdateWithoutKitInput = {
    pro_id?: IntFieldUpdateOperationsInput | number
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: NullableIntFieldUpdateOperationsInput | number | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cross_ref?: cross_refUncheckedUpdateManyWithoutProduitNestedInput
    produit_categorie?: produit_categorie_cenov_dev_ewanUncheckedUpdateManyWithoutProduitNestedInput
    tarif_achat?: tarif_achat_cenov_dev_ewanUncheckedUpdateManyWithoutProduitNestedInput
  }

  export type produitUncheckedUpdateManyWithoutKitInput = {
    pro_id?: IntFieldUpdateOperationsInput | number
    pro_code?: NullableStringFieldUpdateOperationsInput | string | null
    fk_supplier?: NullableIntFieldUpdateOperationsInput | number | null
    fk_famille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_sfamille?: NullableIntFieldUpdateOperationsInput | number | null
    fk_ssfamille?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type kit_attribute_cenov_dev_ewanUpdateWithoutKitInput = {
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    attribut_kit_attribute_fk_attribute_caracToattribut?: attribut_cenov_dev_ewanUpdateOneWithoutKit_attribute_kit_attribute_fk_attribute_caracToattributNestedInput
    attribut_kit_attribute_fk_attribute_unitToattribut?: attribut_cenov_dev_ewanUpdateOneWithoutKit_attribute_kit_attribute_fk_attribute_unitToattributNestedInput
  }

  export type kit_attribute_cenov_dev_ewanUncheckedUpdateWithoutKitInput = {
    fk_attribute_carac?: NullableIntFieldUpdateOperationsInput | number | null
    fk_attribute_unit?: NullableIntFieldUpdateOperationsInput | number | null
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kat_id?: IntFieldUpdateOperationsInput | number
  }

  export type kit_attribute_cenov_dev_ewanUncheckedUpdateManyWithoutKitInput = {
    fk_attribute_carac?: NullableIntFieldUpdateOperationsInput | number | null
    fk_attribute_unit?: NullableIntFieldUpdateOperationsInput | number | null
    kat_valeur?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    kat_id?: IntFieldUpdateOperationsInput | number
  }

  export type part_nc_cenov_dev_ewanUpdateWithoutKitInput = {
    par_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type part_nc_cenov_dev_ewanUncheckedUpdateWithoutKitInput = {
    par_id?: IntFieldUpdateOperationsInput | number
    par_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type part_nc_cenov_dev_ewanUncheckedUpdateManyWithoutKitInput = {
    par_id?: IntFieldUpdateOperationsInput | number
    par_label?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}